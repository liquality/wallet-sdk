import { FeeData, Provider } from "@ethersproject/providers";
import BigNumber from "bignumber.js";
import {
  BigNumber as EthersBigNumber,
  ethers,
  PopulatedTransaction,
} from "ethers";
import { parseEther } from "ethers/lib/utils";
import { Config } from "../common/config";
import { getChainProvider } from "../factory/chain-provider";
import { gasMultiplier } from "./constants/gas-price-multipliers";
import { TX_STATUS } from "./constants/transaction-status";
import TransactionSpeed from "./types/transaction-speed";
import { Web3Provider ,ExternalProvider } from "@ethersproject/providers";
import { getWallet } from "../common/utils";
import { Gelato } from "../gasless-providers/gelato"

export abstract class TransactionService {
  public static async prepareTransaction(
    txRequest: PopulatedTransaction,
    chainID: number,
    speed = TransactionSpeed.Average,
  ): Promise<PopulatedTransaction> {
    const chainProvider = await getChainProvider(chainID);
    const fees = await this.getFees(speed, chainProvider);
    return {
      ...txRequest,
      ...fees,
      gasLimit: await this.estimateGas(txRequest, chainProvider),
      nonce: await chainProvider.getTransactionCount(txRequest.from!),
      ...(!!fees.maxFeePerGas && { type: 2 }),
    } as PopulatedTransaction;
  }

  public static async sendGaslessly(contractAddress:string, data: string, pkOrProvider: string | ExternalProvider, chainID?: number): Promise<string> {
    let wallet;
    let sender;
    if (typeof pkOrProvider !== "string") {
      wallet = new Web3Provider(pkOrProvider).getSigner();
      chainID = await wallet.getChainId();
      sender = await wallet.getAddress();
    } else {
      wallet = await getWallet(pkOrProvider, chainID!);
      sender = await wallet.getAddress();
    }
    return Gelato.sendTx(chainID!, contractAddress, sender, data, pkOrProvider);
  }

  public static async getTransactionStatus(
    hash: string,
    chainID: number,
    minBlockConfirmation = 0,
  ): Promise<string> {
    const chainProvider = await getChainProvider(chainID);
    const tx = await chainProvider.getTransaction(hash);
    if (!tx) throw Error(TX_STATUS.NOT_FOUND);
    if (
      tx.confirmations &&
      tx.confirmations > minBlockConfirmation
    ) {
      const { status } = await chainProvider.getTransactionReceipt(
        hash
      );
      if (Number(status) === 1) {
        return TX_STATUS.SUCCESS;
      } else {
        return TX_STATUS.FAILED;
      }
    }
    return TX_STATUS.NOT_CONFIRMED;
  }

  private static async getFees(
    speed: TransactionSpeed,
    chainProvider: Provider
  ): Promise<Partial<FeeData>> {
    const fees = await chainProvider.getFeeData();

    const extractedFees: Partial<FeeData> = {};
    if (fees.maxFeePerGas) {
      extractedFees.maxFeePerGas = this.calculateFee(
        fees.maxFeePerGas,
        gasMultiplier(speed)
      );
      extractedFees.maxPriorityFeePerGas = this.calculateFee(
        fees.maxPriorityFeePerGas!,
        gasMultiplier(speed)
      );
    } else {
      extractedFees.gasPrice = this.calculateFee(
        fees.gasPrice!,
        gasMultiplier(speed)
      );
    }

    return extractedFees;
  }

  private static async estimateGas(
    txRequest: PopulatedTransaction,
    chainProvider: Provider
  ) {
    try {
        const estimation = await chainProvider.estimateGas(txRequest);
        // do not add gas limit margin for sending native asset
        if (estimation.eq(21000)) {
          return estimation;
        }
        // gas estimation is increased with 50%
        else {
          return this.calculateGasMargin(estimation);
        }
    } catch (error) {
      return this.calculateGasMargin(ethers.BigNumber.from("72000"));
    }
  }

  private static toEthersBigNumber(a: BigNumber | string): EthersBigNumber {
    if (typeof a === "string") return EthersBigNumber.from(a);
    return EthersBigNumber.from(a.toFixed(0));
  }

  private static calculateGasMargin(value: EthersBigNumber): EthersBigNumber {
    const offset = new BigNumber(value.toString())
      .multipliedBy(Config.GAS_LIMIT_MARGIN)
      .div("10000");
    const estimate = this.toEthersBigNumber(
      offset.plus(value.toString()).toFixed(0)
    );
    return estimate;
  }

  private static calculateFee(
    base: EthersBigNumber,
    multiplier: number
  ): EthersBigNumber {
    return this.toEthersBigNumber(
      new BigNumber(base.toString()).times(multiplier)
    );
  }

  public static async transfer(
    sender: string,
    recipient: string,
    amount: string,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGasless: boolean
  ): Promise<string> {
    const preparedTx = await TransactionService.prepareTransaction(
      {
        from: sender,
        to: recipient,
        value: parseEther(amount),
        chainId,
      },
      chainId
    );

    return (
      await (await getWallet(pkOrProvider, chainId)).sendTransaction(
        preparedTx
      )
    ).hash;
  }
}
