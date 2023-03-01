import { AlchemyNftProvider } from "./providers/alchemy-nft.provider";
import { BaseNftProvider } from "./providers/base-nft.provider";
import { Nft, NftsForContract, NftType } from "./types";

export abstract class NftProvider extends BaseNftProvider {
  private static nftProviders: BaseNftProvider[] = [AlchemyNftProvider];

  // Get all the NFTs owned by an address
  public static async getNfts(
    owner: string,
    chainID: number
  ): Promise<Nft[] | null> {
    let nfts: any;

    // Go through each nftProviders until one succeeds.
    for (let i = 0; i < this.nftProviders.length && !nfts; i++) {
      nfts = await this.nftProviders[i].getNfts(owner, chainID);
    }

    return nfts;
  }

  public static async getNftType(
    contractAddress: string,
    chainID: number
  ): Promise<NftType> {
    // Go through each nftProviders until one succeeds.
    let nftType: NftType;

    for (let i = 0; i < this.nftProviders.length && !nftType!; i++) {
      nftType = await this.nftProviders[i].getNftType(contractAddress, chainID);
    }
    return nftType!;
  }

  // Gets all Nfts minted from a contract. 
  // use the pageKey( returned with each response ) to request the next page of nfts
  // pageSize is 100 by default
  public static async getNftsForContract(
    contractAddress: string,
    chainID: number,
    options?: {pageKey?: string, pageSize?: number},
  ): Promise<NftsForContract | null> {
    if(!options?.pageSize) options = {...options, pageSize: 100}  // Default pagesize to max page size of alchemy nft provider

    // Go through each nftProviders until one succeeds.
    let nfts: NftsForContract | null;

    for (let i = 0; i < this.nftProviders.length && !nfts!; i++) {
      nfts = await this.nftProviders[i].getNftsForContract(contractAddress, chainID, options);
    }
    return nfts!;
  }
}
