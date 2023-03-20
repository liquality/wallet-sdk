import { NftTokenType, Nft as AlchemyNft } from "alchemy-sdk";
import { getAlchemyProvider } from "../../factory/alchemy-provider";
import { Nft, NftsForContract, NftType } from "../types";
import { BaseNftProvider } from "./base-nft.provider";

export abstract class AlchemyNftProvider extends BaseNftProvider {
  constructor() {
    super();
  }

  public static async getNfts(
    owner: string,
    chainID: number
  ): Promise<Nft[] | null> {
    try {
      const alchemy = getAlchemyProvider(chainID);
      const nfts = (await alchemy.nft.getNftsForOwner(owner)).ownedNfts;
      
      return nfts.map((nft) => {
        return {
          id: nft.tokenId,
          contract: {
            address: nft.contract.address,
            name: nft.contract.name || "",
            symbol: nft.contract.symbol || "",
            type: this.extractNftType(nft.tokenType) || undefined,
          },
          metadata: {
            name: nft!.rawMetadata!.name || "",
            description: nft!.rawMetadata!.description || "",
            image: nft!.rawMetadata!.image || "",
          },
          rawMetadata: nft!.rawMetadata,
          balance: this.isERC1155(nft) ? nft.balance : undefined,
        };
      });
    } catch (error) {
      return null;
    }
  }

  public static async getNftsForContract(
    contractAddress: string,
    chainID: number,
    options?: {pageKey?: string, pageSize?: number},
  ): Promise<NftsForContract | null> {
    try {
      const alchemy = getAlchemyProvider(chainID);
      const nftsResponse = await alchemy.nft.getNftsForContract(contractAddress, {...(options?.pageKey && {pageKey: options?.pageKey}), ...(options?.pageSize && {pageSize: options?.pageSize})});
      
      const tokenIDs =  nftsResponse.nfts.map(nft => nft.tokenId);
      return {tokenIDs, pageKey: nftsResponse.pageKey }
    } catch (error) {
      return null;
    }
  }

  public static async getNftType(
    contractAddress: string,
    chainID: number
  ): Promise<NftType> {
    const alchemy = getAlchemyProvider(chainID);
    const nft = await alchemy.nft.getContractMetadata(contractAddress);
    return this.extractNftType(nft.tokenType);
  }

  private static extractNftType(alchemyNftType: NftTokenType): NftType {
    if (alchemyNftType === NftTokenType.ERC1155) return NftType.ERC1155;
    else if (alchemyNftType === NftTokenType.ERC721) return NftType.ERC721;
    else return NftType.UNKNOWN;
  }

  private static isERC1155(nft: AlchemyNft): boolean {
    return nft.contract.tokenType === NftTokenType.ERC1155;
  }
}
