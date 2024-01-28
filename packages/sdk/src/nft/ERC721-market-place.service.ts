import {
  CreateERC721CollectionRequest,
  MintERC721Request,
} from "./types";
import { AddressZero } from "@ethersproject/constants";
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";
import { 
  ERC20,
  ERC20__factory,
  LiqERC721MarketPlaceMeta__factory,
  LiqERC721MarketPlace__factory,
} from "../../typechain-types";
import { TransactionService } from "../transaction/transaction.service";
import { getChainProvider } from "../factory/chain-provider";
import { getWallet } from "../common/utils";
import { GELATO_RELAY_ADDRESS, GELATO_SUPPORTED_NETWORKS } from "../common/constants";
import { Gelato } from "../gasless-providers/gelato";
import { formatUnits, parseUnits } from "ethers/lib/utils";
export abstract class Nft721MarketPlace {


  public static async create(
    { tokenName, tokenSymbol }: CreateERC721CollectionRequest,
    platformFee: number, // 100 is same as 1%, 1000 is same as 0.1%
    feeCollector: string,
    paymentToken: string,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGaslessCompliant: boolean
  ): Promise<string> {
    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();

    let contractFactory;
    let args = [tokenName,tokenSymbol,platformFee,feeCollector,paymentToken];

    if(isGaslessCompliant) {

      if(!GELATO_SUPPORTED_NETWORKS.includes(chainId)) throw("Cannot deploy gasless compliant contract on the chain. not supported by us now");
        contractFactory = new ethers.ContractFactory(
          LiqERC721MarketPlaceMeta__factory.abi,
          LiqERC721MarketPlaceMeta__factory.bytecode,
          wallet
        );
        args.push(GELATO_RELAY_ADDRESS);
    }else{
      contractFactory = new ethers.ContractFactory(
        LiqERC721MarketPlace__factory.abi,
        LiqERC721MarketPlace__factory.bytecode,
        wallet
      );
    }


    const tx = contractFactory.getDeployTransaction(...args);

    const preparedTx = await TransactionService.prepareTransaction(
      {
        from: owner,
        to: undefined,
        data: tx.data?.toString(),
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

  public static async mint(
    { contractAddress, uri }: Partial<MintERC721Request>,
    price: string,
    sellable: boolean,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGasless: boolean
  ): Promise<string> {
    const contract = LiqERC721MarketPlaceMeta__factory.connect(
      AddressZero,
      await getChainProvider(chainId)
    ).attach(contractAddress!);

    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();

    const tx = await contract.populateTransaction.safeMint(uri!, price, sellable);

    if(isGasless) return Gelato.sendTx(chainId,contractAddress!,owner,tx.data!,pkOrProvider);

    const preparedTx = await TransactionService.prepareTransaction(
      {
        ...tx,
        from: owner,
        chainId,
      },
      chainId
    );

    return (
      await wallet.sendTransaction(
        preparedTx
      )
    ).hash;

  }

  public static async tip(
    contractAddress: string,
    tokenID: string,
    amount: string,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGasless: boolean
  ): Promise<string> {
    const contract = LiqERC721MarketPlaceMeta__factory.connect(
      AddressZero,
      await getChainProvider(chainId)
    ).attach(contractAddress!);

    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();

    const paymentToken = await contract.paymentToken();
    const decimals = await this.getPaymentTokenDecimals(paymentToken, chainId);

    const tx = await contract.populateTransaction.tipCreator(tokenID, parseUnits(amount,decimals));

    if(isGasless) return Gelato.sendTx(chainId,contractAddress!,owner,tx.data!,pkOrProvider);

    const preparedTx = await TransactionService.prepareTransaction(
      {
        ...tx,
        from: owner,
        chainId,
      },
      chainId
    );

    return (
      await wallet.sendTransaction(
        preparedTx
      )
    ).hash;
  }

  public static async buy(
    contractAddress: string,
    tokenID: string,
    newPrice: string,
    sellable: boolean,
    payment: string,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGasless: boolean
  ): Promise<string> {
    const contract = LiqERC721MarketPlaceMeta__factory.connect(
      AddressZero,
      await getChainProvider(chainId)
    ).attach(contractAddress!);

    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();

    const paymentToken = await contract.paymentToken();
    const decimals = await this.getPaymentTokenDecimals(paymentToken, chainId);
    
    const tx = await contract.populateTransaction.buyNft(tokenID, parseUnits(newPrice,decimals), sellable, payment);

    if(isGasless) return Gelato.sendTx(chainId,contractAddress!,owner,tx.data!,pkOrProvider);

    const preparedTx = await TransactionService.prepareTransaction(
      {
        ...tx,
        from: owner,
        chainId,
      },
      chainId
    );

    return (
      await wallet.sendTransaction(
        preparedTx
      )
    ).hash;
  }

  public static async tokenInfo(
    contractAddress: string,
    tokenID: string,
    chainId: number,
  ) {
    const contract = LiqERC721MarketPlaceMeta__factory.connect(
      AddressZero,
      await getChainProvider(chainId)
    ).attach(contractAddress!);

    const paymentToken = await contract.paymentToken();
    const decimals = await this.getPaymentTokenDecimals(paymentToken, chainId);
    
    const tokenInfo = await contract.tokensInfo(tokenID);
    const price = formatUnits(tokenInfo.price, decimals);

    return {...tokenInfo, price};
  }

  private static async getPaymentTokenDecimals(contractAddress: string, chainId: number) {
    const contract: ERC20 = ERC20__factory.connect(
      AddressZero,
      await getChainProvider(chainId)
    ).attach(contractAddress);
    return await contract.decimals();
  }
}
