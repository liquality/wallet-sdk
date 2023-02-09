import { AlchemyNftProvider } from "./providers/alchemy-nft.provider";
import { BaseNftProvider } from "./providers/base-nft.provider";
import { Nft, NftType } from "./types";

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
}
