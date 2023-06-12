import { PopulatedTransaction } from "@ethersproject/contracts";
import {
  CreateERC1155CollectionRequest,
  CreateERC721CollectionRequest,
  MintERC1155Request,
  MintERC721Request,
  Nft,
  NftInfo,
  NftType,
  TransferRequest,
} from "./types";
import { AddressZero } from "@ethersproject/constants";
import { NftProvider } from "./nft.provider";
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";
import { 
  LiqERC1155,
  LiqERC1155Meta__factory,
  LiqERC1155__factory,
  LiqERC721,
  LiqERC721Meta__factory,
  LiqERC721__factory,
} from "../../typechain-types";
import { TransactionService } from "../transaction/transaction.service";
import { getChainProvider } from "../factory/chain-provider";
import { getChainID, getWallet } from "../common/utils";
import { GELATO_RELAY_ADDRESS, GELATO_SUPPORTED_NETWORKS } from "../common/constants";
import { Wallet } from "alchemy-sdk";
import { Gelato } from "../gasless-providers/gelato";
export abstract class NftService {
  private static cache: Record<string, NftInfo> = {};

  // Get all the NFTs owned by an address
  public static async getNfts(
    owner: string,
    chainID: number
  ): Promise<Nft[] | null> {
    return NftProvider.getNfts(owner, chainID);
  }

  // Gets all Nfts minted from a contract. 
  // use the pageKey( returned with each response ) to request the next page of nfts
  // pageSize is 100 by default
  public static async getNftsForContract(contractAddress: string, chainID: number, options?: {pageKey?: string, pageSize?: number}){
      return NftProvider.getNftsForContract(contractAddress, chainID, options);
  }

  public static async transferNft(
    transferRequest: TransferRequest,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGasless: boolean
  ): Promise<string> {
    chainId = await getChainID(pkOrProvider, chainId);

    const { contractAddress, receiver, tokenIDs, amounts } =
      transferRequest;
    
    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();
    let tx: PopulatedTransaction;
    const data = "0x";

    if (!amounts) { // ERC721 will not have amounts set
      const { contract } = await this.cacheGet(contractAddress, chainId, NftType.ERC721);

      const _contract: LiqERC721 = contract as LiqERC721;
      tx = await _contract.populateTransaction[
        "safeTransferFrom(address,address,uint256)"
      ](owner, receiver, tokenIDs[0]);
    }else{
      const { contract } = await this.cacheGet(contractAddress, chainId, NftType.ERC1155);
      const _contract: LiqERC1155 = contract as LiqERC1155;
      if (tokenIDs.length > 1) {  
        tx = await _contract.populateTransaction.safeBatchTransferFrom(
          owner,
          receiver,
          tokenIDs,
          amounts!,
          data
        );  
      }else{
        tx = await _contract.populateTransaction.safeTransferFrom(
          owner,
          receiver,
          tokenIDs[0],
          amounts![0],
          data
        );
      }
    }


    if(isGasless) return Gelato.sendTx(chainId,contractAddress,owner,tx.data!,pkOrProvider);

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

  private static async cacheGet(
    contractAddress: string,
    chainID: number,
    nftType?: NftType
  ): Promise<NftInfo> {
    if (NftService.cache[contractAddress]) {
      return NftService.cache[contractAddress];
    }

    if(!nftType) nftType = await NftProvider.getNftType(contractAddress, chainID);

    if (nftType !== NftType.UNKNOWN) {
      const contractFactory =
        nftType == NftType.ERC1155 ? LiqERC1155__factory : LiqERC721__factory;
      NftService.cache[contractAddress] = {
        contract: contractFactory
          .connect(AddressZero, await getChainProvider(chainID))
          .attach(contractAddress),
        schema: nftType,
      };

      return NftService.cache[contractAddress];
    }

    throw new Error(`${contractAddress} is not an NFT contract`);
  }

  public static async createERC1155Collection(
    { uri }: CreateERC1155CollectionRequest,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGaslessCompliant: boolean
  ): Promise<string> {
    chainId = await getChainID(pkOrProvider, chainId);

    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();

    let contractFactory;
    let args = [uri];

    if(isGaslessCompliant) {
      if(!GELATO_SUPPORTED_NETWORKS.includes(chainId)) throw("Cannot deploy gasless compliant contract on the chain. not supported by us now");
      contractFactory = new ethers.ContractFactory(
        LiqERC1155Meta__factory.abi,
        LiqERC1155Meta__factory.bytecode,
        wallet
      );
      args.push(GELATO_RELAY_ADDRESS);

    }else{
      contractFactory = new ethers.ContractFactory(
        LiqERC1155__factory.abi,
        LiqERC1155__factory.bytecode,
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

  public static async mintERC1155Token(
    { contractAddress, recipient, id, amount }: MintERC1155Request,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGasless: boolean
  ): Promise<string> {
    chainId = await getChainID(pkOrProvider, chainId);

    const contract = LiqERC1155__factory.connect(
      AddressZero,
      await getChainProvider(chainId)
    ).attach(contractAddress);
    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();

    const data = "0x";
    const tx = await contract.populateTransaction.mint(
      recipient,
      id,
      amount,
      data
    );

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
      await wallet.sendTransaction(
        preparedTx
      )
    ).hash;
  }

  public static async createERC721Collection(
    { tokenName, tokenSymbol }: CreateERC721CollectionRequest,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGaslessCompliant: boolean
  ): Promise<string> {
    chainId = await getChainID(pkOrProvider, chainId);

    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();

    let contractFactory;
    let args = [tokenName, tokenSymbol];
    if(isGaslessCompliant) {
      if(!GELATO_SUPPORTED_NETWORKS.includes(chainId)) throw("Cannot deploy gasless compliant contract on the chain. not supported by us now");
      contractFactory = new ethers.ContractFactory(
        LiqERC721Meta__factory.abi,
        LiqERC721Meta__factory.bytecode,
        wallet
      );
      args.push(GELATO_RELAY_ADDRESS);


    }else{
      contractFactory = new ethers.ContractFactory(
        LiqERC721__factory.abi,
        LiqERC721__factory.bytecode,
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

  public static async mintERC721Token(
    { contractAddress, recipient, uri }: MintERC721Request,
    chainId: number,
    pkOrProvider: string | ExternalProvider,
    isGasless: boolean
  ): Promise<string> {
    chainId = await getChainID(pkOrProvider, chainId);

    const contract = LiqERC721__factory.connect(
      AddressZero,
      await getChainProvider(chainId)
    ).attach(contractAddress);

    const wallet = await getWallet(pkOrProvider, chainId);
    const owner = await wallet.getAddress();

    const tx = await contract.populateTransaction.safeMint(recipient, uri);

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
      await wallet.sendTransaction(
        preparedTx
      )
    ).hash;

}
}
