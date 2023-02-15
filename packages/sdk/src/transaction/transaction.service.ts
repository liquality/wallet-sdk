import { FeeData, Provider } from "@ethersproject/providers";
import BigNumber from "bignumber.js";
import {
  BigNumber as EthersBigNumber,
  PopulatedTransaction,
  Wallet,
} from "ethers";
import { parseEther } from "ethers/lib/utils";
import { Config } from "../common/config";
import { getChainProvider } from "../factory/chain-provider";
import { gasMultiplier } from "./constants/gas-price-multipliers";
import TransactionSpeed from "./types/transaction-speed";

export abstract class TransactionService {
  public static async prepareTransaction(
    txRequest: PopulatedTransaction,
    chainID: number,
    speed = TransactionSpeed.Average
  ): Promise<PopulatedTransaction> {
    const chainProvider = getChainProvider(chainID);
    const fees = await this.getFees(speed, chainProvider);
    return {
      ...txRequest,
      ...fees,
      gasLimit: await this.estimateGas(txRequest, chainProvider),
      nonce: await chainProvider.getTransactionCount(txRequest.from!),
      ...(!!fees.maxFeePerGas && { type: 2 }),
    } as PopulatedTransaction;
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
    const estimation = await chainProvider.estimateGas(txRequest);
    // do not add gas limit margin for sending native asset
    if (estimation.eq(21000)) {
      return estimation;
    }
    // gas estimation is increased with 50%
    else {
      return this.calculateGasMargin(estimation);
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
    pk: string
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
      await new Wallet(pk, getChainProvider(chainId)).sendTransaction(
        preparedTx
      )
    ).hash;
  }
}
