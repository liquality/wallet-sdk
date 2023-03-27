import { getAlchemyProvider } from "../factory/alchemy-provider";
import BigNumber from "bignumber.js";
import { TransferERC20Request } from "./types";
import { ERC20 as ERC20Contract, ERC20__factory } from "../../typechain-types";
import { AddressZero } from "@ethersproject/constants";
import { getChainProvider } from "../factory/chain-provider";
import { TransactionService } from "../transaction/transaction.service";
import { getWallet } from "../common/utils";
import { ExternalProvider } from "@ethersproject/providers";
import { Gelato } from "../gasless-providers/gelato";

type AccountToken = {
  tokenContractAddress: string | null
  tokenName: string | null
  tokenSymbol: string | null
  rawBalance: string | null
  formattedBalance: string | undefined
}



export abstract class ERC20Service {
  public static async listAccountTokens(address: string, chainID: number): Promise<AccountToken[]> {
    const alchemyProvider = getAlchemyProvider(chainID);

    const balances = await alchemyProvider.core.getTokenBalances(address);

    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0";
    });

    const accountTokens = [];
    for (let token of nonZeroBalances) {
      let balance = token.tokenBalance;

      // Get metadata of token
      const metadata = await alchemyProvider.core.getTokenMetadata(
        token.contractAddress
      );

      // Compute token balance in human-readable format
      let formattedBalance;
      if (balance && metadata.decimals) {
        formattedBalance = new BigNumber(balance).div(
          Math.pow(10, metadata.decimals)
        );
        formattedBalance = formattedBalance.toFixed(2);
      }

      accountTokens.push({
        tokenContractAddress: token.contractAddress,
        tokenName: metadata.name,
        tokenSymbol: metadata.symbol,
        rawBalance: balance,
        formattedBalance,
      });
    }

    return accountTokens;
  }

  public static async getBalance(
    contractAddress: string,
    ownerAddress: string,
    chainID: number
  ) {
    const alchemyProvider = getAlchemyProvider(chainID);

    const balance = (
      await alchemyProvider.core.getTokenBalances(ownerAddress, [
        contractAddress,
      ])
    ).tokenBalances[0].tokenBalance;

    // Get metadata of token
    const metadata = await alchemyProvider.core.getTokenMetadata(
      contractAddress
    );

    // Compute token balance in human-readable format
    let formattedBalance;
    if (balance && metadata.decimals) {
      formattedBalance = new BigNumber(balance).div(
        Math.pow(10, metadata.decimals)
      );
      formattedBalance = formattedBalance.toString();
    }

    return {
      tokenName: metadata.name,
      tokenSymbol: metadata.symbol,
      rawBalance: balance,
      formattedBalance,
    };
  }

  public static async transfer(
    transferRequest: TransferERC20Request,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGasless: boolean
  ): Promise<string> {
    const { contractAddress, owner, receiver, amount } = transferRequest;
    const contract: ERC20Contract = ERC20__factory.connect(
      AddressZero,
      await getChainProvider(chainId)
    ).attach(contractAddress);

    const tx = await contract.populateTransaction.transfer(receiver, amount);

    if(isGasless) return Gelato.sendTx(chainId,contractAddress,owner,tx.data!,pkOrProvider)

    const preparedTx = await TransactionService.prepareTransaction(
      {
        ...tx,
        from: owner,
        chainId,
      },
      chainId
    );

    return (
      await ( await getWallet(pkOrProvider, chainId)).sendTransaction(
        preparedTx
      )
    ).hash;
  }
}
