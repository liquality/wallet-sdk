import { PopulatedTransaction } from "@ethersproject/contracts";
import {
  CreateERC1155CollectionRequest,
  CreateERC721CollectionRequest,
  Nft,
  NftInfo,
  NftType,
  TransferRequest,
} from "./types";
import { AddressZero } from "@ethersproject/constants";
import { NftProvider } from "./nft.provider";
import { ethers, Wallet } from "ethers";
import {
  LiqERC1155,
  LiqERC1155__factory,
  LiqERC721,
  LiqERC721__factory,
} from "../../typechain-types";
import { TransactionService } from "../transaction/transaction.service";
import { getChainProvider } from "../factory/chain-provider";
import { MintERC1155Request, MintERC721Request } from "../types";

export abstract class NftService {
  private static cache: Record<string, NftInfo> = {};

  // Get all the NFTs owned by an address
  public static async getNfts(
    owner: string,
    chainID: number
  ): Promise<Nft[] | null> {
    return NftProvider.getNfts(owner, chainID);
  }

  public static async transferNft(
    transferRequest: TransferRequest,
    chainId: number,
    pk: string
  ): Promise<string> {
    const { contractAddress, owner, receiver, tokenIDs, amounts } =
      transferRequest;
    const { schema, contract } = await this.cacheGet(contractAddress, chainId);

    let tx: PopulatedTransaction;
    const data = "0x";

    switch (schema) {
      case NftType.ERC721: {
        if (tokenIDs.length !== 1) {
          throw new Error(
            `ERC 721 transfer supports exactly 1 tokenID, received ${tokenIDs.join()}`
          );
        }
        const _contract: LiqERC721 = contract as LiqERC721;
        tx = await _contract.populateTransaction[
          "safeTransferFrom(address,address,uint256)"
        ](owner, receiver, tokenIDs[0]);
        break;
      }

      case NftType.ERC1155: {
        const _contract: LiqERC1155 = contract as LiqERC1155;
        if (tokenIDs.length > 1) {
          tx = await _contract.populateTransaction.safeBatchTransferFrom(
            owner,
            receiver,
            tokenIDs,
            amounts!,
            data
          );
        } else {
          tx = await _contract.populateTransaction.safeTransferFrom(
            owner,
            receiver,
            tokenIDs[0],
            amounts![0],
            data
          );
        }
        break;
      }

      default: {
        throw new Error(`Unsupported NFT type: ${schema}`);
      }
    }

    const preparedTx = await TransactionService.prepareTransaction(
      {
        ...tx,
        from: owner,
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

  private static async cacheGet(
    contractAddress: string,
    chainID: number
  ): Promise<NftInfo> {
    if (NftService.cache[contractAddress]) {
      return NftService.cache[contractAddress];
    }

    const nftType = await NftProvider.getNftType(contractAddress, chainID);

    if (nftType !== NftType.UNKNOWN) {
      const contractFactory =
        nftType == NftType.ERC1155 ? LiqERC1155__factory : LiqERC721__factory;
      NftService.cache[contractAddress] = {
        contract: contractFactory
          .connect(AddressZero, getChainProvider(chainID))
          .attach(contractAddress),
        schema: nftType,
      };

      return NftService.cache[contractAddress];
    }

    throw new Error(`${contractAddress} is not an NFT contract`);
  }

  public static async createERC1155Collection(
    { uri, creator }: CreateERC1155CollectionRequest,
    chainId: number,
    pk: string
  ): Promise<string> {
    const contractFactory = new ethers.ContractFactory(
      LiqERC1155__factory.abi,
      LiqERC1155__factory.bytecode
    );
    const deployTx = contractFactory.getDeployTransaction(uri);

    const preparedTx = await TransactionService.prepareTransaction(
      {
        data: deployTx.data!.toString(),
        from: creator,
        chainId,
        to: AddressZero,
      },
      chainId
    );

    return (
      await new Wallet(pk, getChainProvider(chainId)).sendTransaction(
        preparedTx
      )
    ).hash;
  }

  public static async mintERC1155Token(
    { contractAddress, owner, recipient, id, amount }: MintERC1155Request,
    chainId: number,
    pk: string
  ): Promise<string> {
    const contract = LiqERC1155__factory.connect(
      AddressZero,
      getChainProvider(chainId)
    ).attach(contractAddress);
    const data = "0x";
    const tx = await contract.populateTransaction.mint(
      recipient,
      id,
      amount,
      data
    );

    const preparedTx = await TransactionService.prepareTransaction(
      {
        ...tx,
        from: owner,
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

  public static async createERC721Collection(
    { tokenName, tokenSymbol, creator }: CreateERC721CollectionRequest,
    chainId: number,
    pk: string
  ): Promise<string> {
    const contractFactory = new ethers.ContractFactory(
      LiqERC721__factory.abi,
      LiqERC721__factory.bytecode
    );
    const deployTx = contractFactory.getDeployTransaction(
      tokenName,
      tokenSymbol
    );

    const preparedTx = await TransactionService.prepareTransaction(
      {
        data: deployTx.data!.toString(),
        from: creator,
        chainId,
        to: AddressZero,
      },
      chainId
    );

    return (
      await new Wallet(pk, getChainProvider(chainId)).sendTransaction(
        preparedTx
      )
    ).hash;
  }

  public static async mintERC721Token(
    { contractAddress, owner, recipient, uri }: MintERC721Request,
    chainId: number,
    pk: string
  ): Promise<string> {
    const contract = LiqERC721__factory.connect(
      AddressZero,
      getChainProvider(chainId)
    ).attach(contractAddress);
    const tx = await contract.populateTransaction.safeMint(recipient, uri);

    const preparedTx = await TransactionService.prepareTransaction(
      {
        ...tx,
        from: owner,
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
