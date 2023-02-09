import axios from "axios";
import { BigNumber as EthersBigNumber, Contract, ethers, Wallet } from "ethers";
import { getChainProvider } from "../../factory/chain-provider";
import { TransactionService } from "../../transaction/transaction.service";
import { DebridgeConfig } from "./config";
import { FullSubmissionInfo, SwapRequest } from "./types";
import { withInterval } from "../../common/utils";
import SignatureVerifier from "./abi/SignatureVerifier.json";
import { AddressZero } from "@ethersproject/constants";
import { ERC20, ERC20__factory } from "../../../typechain-types";
import { parseEther, parseUnits } from "ethers/lib/utils";
import BigNumber from "bignumber.js";

export abstract class DebridgeSwapProvider {
  private static readonly config = DebridgeConfig;

  public static async swap(swapRequest: SwapRequest, pk: string) {
    // Validation
    const isSrcChainSupported = !!this.config.chains[swapRequest.srcChainId];
    const isDstChainSupported = !!this.config.chains[swapRequest.srcChainId];
    if (
      new BigNumber(swapRequest.srcChainTokenInAmount).lte(0) ||
      !isSrcChainSupported ||
      !isDstChainSupported
    )
      throw Error("Swap not supported");

    const chainProvider = getChainProvider(swapRequest.srcChainId);
    const wallet = new Wallet(pk, chainProvider);
    let fromAmountInUnits: string;

    if (swapRequest.srcChainTokenIn !== AddressZero) {
      // Approve token
      const contract: ERC20 = ERC20__factory.connect(
        AddressZero,
        chainProvider
      ).attach(swapRequest.srcChainTokenIn);
      const decimals = await contract.decimals();

      const fromAmountInUnits = parseUnits(
        swapRequest.srcChainTokenInAmount,
        decimals
      ).toString();

      await this.approveToken(contract, fromAmountInUnits, wallet);
    } else {
      fromAmountInUnits = parseEther(
        swapRequest.srcChainTokenInAmount
      ).toString();
    }

    if (swapRequest.srcChainId === swapRequest.dstChainId)
      return this.singleChainSwap(swapRequest, fromAmountInUnits!, wallet);
    return this.crossChainSwap(swapRequest, fromAmountInUnits!, wallet);
  }

  private static async singleChainSwap(
    swapRequest: SwapRequest,
    fromAmountInUnits: string,
    wallet: Wallet
  ) {
    const {
      srcChainId: chainId,
      srcChainTokenIn: tokenIn,
      srcChainTokenInAmount: tokenInAmount,
      dstChainTokenOut: tokenOut,
      dstChainTokenOutRecipient: tokenOutRecipient,
    } = swapRequest;
    const tx = await axios({
      url: this.config.url + "chain/transaction",
      method: "get",
      params: {
        chainId,
        tokenIn,
        tokenInAmount: fromAmountInUnits,
        tokenOut,
        tokenOutRecipient,
      },
    });

    const preparedTx = await TransactionService.prepareTransaction(
      {
        to: tx.data.to,
        value: tx.data.value,
        data: tx.data.value,
      },
      chainId
    );

    const swapTx = await wallet.sendTransaction(preparedTx);
    const swapConfirmation = await this.waitForSingleChainSwapConfirmations(
      swapTx.hash,
      chainId
    );
    if (swapConfirmation.status === "FAILED") return false;

    return {
      swapTxHash: swapTx.hash,
    };
  }

  private static async crossChainSwap(
    swapRequest: SwapRequest,
    fromAmountInUnits: string,
    wallet: Wallet
  ) {
    const {
      srcChainId,
      srcChainTokenIn,
      srcChainTokenInAmount,
      dstChainId,
      dstChainTokenOut,
      dstChainTokenOutRecipient,
    } = swapRequest;
    const tx = await axios({
      url: this.config.url + "transaction",
      method: "get",
      params: {
        srcChainId,
        srcChainTokenIn,
        srcChainTokenInAmount: fromAmountInUnits,
        dstChainId,
        dstChainTokenOut,
        dstChainTokenOutRecipient,
      },
    });

    const preparedTx = await TransactionService.prepareTransaction(
      {
        to: tx.data.to,
        value: tx.data.value,
        data: tx.data.value,
      },
      srcChainId
    );

    const sendTx = await wallet.sendTransaction(preparedTx);
    const sendConfirmation = await this.waitForCrossChainSendConfirmations(
      sendTx.hash,
      srcChainId
    );
    if (sendConfirmation.status === "FAILED") return false;
    const receiveConfirmation =
      await this.waitForCrossChainReceiveConfirmations(sendTx.hash);

    return {
      sendTxHash: sendTx.hash,
      receiveTxHash: receiveConfirmation.receiveTxHash,
    };
  }

  private static async approveToken(
    contract: ERC20,
    amount: string,
    wallet: Wallet
  ) {
    if (await this.hasAllowance(contract, amount, wallet.address)) return true;

    const tx = await contract.populateTransaction.approve(
      this.config.routerAddress,
      amount
    );
    const preparedTx = await TransactionService.prepareTransaction(
      {
        ...tx,
        to: contract.address,
      },
      await wallet.getChainId()
    );

    const approveTx = await wallet.sendTransaction(preparedTx);
    await this.waitForApproveConfirmations(approveTx.hash, wallet.provider);
    return true;
  }

  private static async hasAllowance(
    contract: ERC20,
    amount: string,
    fromAddress: string
  ): Promise<boolean> {
    const allowance = await contract.allowance(
      fromAddress,
      this.config.routerAddress
    );
    return allowance.gte(amount);
  }

  private static async waitForApproveConfirmations(
    approveTxHash: string,
    chainProvider: ethers.providers.Provider
  ) {
    return withInterval(async () => {
      try {
        const tx = await chainProvider.getTransaction(approveTxHash);
        if (tx && tx.confirmations && tx.confirmations > 0) {
          return {
            status: "SUCCESS",
          };
        }
      } catch (e) {
        throw Error(`Problem Confirming approval Tx, ${e}`);
      }
    });
  }

  private static async waitForSingleChainSwapConfirmations(
    swapTxHash: string,
    chainId: number
  ) {
    const chainProvider = getChainProvider(chainId);

    return withInterval(async () => {
      try {
        const tx = await chainProvider.getTransaction(swapTxHash);
        if (
          tx.confirmations &&
          tx.confirmations > this.config.chains[chainId].minBlockConfirmation
        ) {
          const { status } = await chainProvider.getTransactionReceipt(
            swapTxHash
          );
          if (Number(status) === 1) {
            return {
              status: "SUCCESS",
            };
          } else {
            return {
              status: "FAILED",
            };
          }
        }
      } catch (e) {
        throw Error(`Problem Confirming Swap Tx, ${e}`);
      }
    });
  }

  private static async waitForCrossChainSendConfirmations(
    sendTxHash: string,
    chainId: number
  ) {
    const chainProvider = getChainProvider(chainId);

    return withInterval(async () => {
      try {
        const tx = await chainProvider.getTransaction(sendTxHash);
        if (
          tx.confirmations &&
          tx.confirmations > this.config.chains[chainId].minBlockConfirmation
        ) {
          const { status } = await chainProvider.getTransactionReceipt(
            sendTxHash
          );
          if (Number(status) === 1) {
            const signatureVerifier = new ethers.Contract(
              this.config.chains[chainId].signatureVerifier,
              SignatureVerifier.abi,
              chainProvider
            );
            const minConfirmations = await signatureVerifier.minConfirmations();
            const count = await this.getConfirmationsCount(sendTxHash);
            if (count >= minConfirmations) {
              return {
                status: "WAITING_FOR_RECEIVE_CONFIRMATIONS",
              };
            }
          } else {
            return {
              status: "FAILED",
            };
          }
        }
      } catch (e) {
        throw Error(`Problem Confirming Send leg, ${e}`);
      }
    });
  }

  private static async waitForCrossChainReceiveConfirmations(
    sendTxHash: string
  ) {
    return withInterval(async () => {
      try {
        const submissionInfo = await this.getFullSubmissionInfo(sendTxHash);

        if (submissionInfo?.send?.isExecuted && submissionInfo?.claim) {
          return {
            receiveTxHash: submissionInfo?.claim.transactionHash,
            status: "SUCCESS",
          };
        }
      } catch (e) {
        throw Error(`Problem Confirming receive leg, ${e}`);
      }
    });
  }

  private static async getConfirmationsCount(
    swapTxHash: string
  ): Promise<number> {
    try {
      const submissionId = await this.getSubmissionId(swapTxHash);
      if (submissionId) {
        const result = await axios({
          url: this.config.api + "SubmissionConfirmations/getForSubmission",
          method: "get",
          params: {
            submissionId: submissionId,
          },
        });
        if (Array.isArray(result?.data)) {
          return result.data.length;
        }
      }
    } catch (e) {}
    return 0;
  }

  private static async getSubmissionId(
    swapTxHash: string
  ): Promise<string | null> {
    try {
      const result = await axios({
        url: this.config.api + "Transactions/GetFullSubmissionInfo",
        method: "get",
        params: {
          filter: swapTxHash,
          filterType: 1,
        },
      });
      return result?.data?.send?.submissionId || null;
    } catch (e) {
      return null;
    }
  }

  private static async getFullSubmissionInfo(
    swapTxHash: string
  ): Promise<FullSubmissionInfo | null> {
    try {
      const result = await axios({
        url: this.config.api + "Transactions/GetFullSubmissionInfo",
        method: "get",
        params: {
          filter: swapTxHash,
          filterType: 1,
        },
      });
      return result?.data || null;
    } catch (e) {
      return null;
    }
  }
}
