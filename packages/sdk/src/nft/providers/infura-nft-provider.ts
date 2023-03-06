import { Nft, NftsForContract, NftType } from "../types";
import { BaseNftProvider } from "./base-nft.provider";
import { getInfuraProvider } from "src/factory/infura-provider";

export abstract class InfuraNftProvider extends BaseNftProvider {
  constructor() {
    super();
  }

  public static async getNfts(
    owner: string,
    chainID: number,
    options?: { pageKey?: string }
  ): Promise<Nft[] | null> {
    try {
      const infura = getInfuraProvider(chainID);
      const nfts = await infura.api.getNFTs({
        publicAddress: owner,
        cursor: options?.pageKey,
      });

      return nfts.assets.map((nft) => {
        return {
          id: nft.tokenId,
          contract: {
            address: nft.contract,
            type: this.extractNftType(nft.type) || undefined,
          },
          metadata: nft.metadata,
          balance: this.isERC1155(nft) ? parseInt(nft.supply, 10) : undefined,
          pageKey: nfts.cursor,
        };
      });
    } catch (error) {
      return null;
    }
  }

  public static async getNftsForContract(
    contractAddress: string,
    chainID: number,
    options?: { pageKey?: string }
  ): Promise<NftsForContract | null> {
    try {
      const infura = getInfuraProvider(chainID);
      const nftsResponse = await infura.api.getNFTsForCollection({
        contractAddress,
        cursor: options?.pageKey,
      });

      const tokenIDs = nftsResponse.assets.map((nft) => nft.tokenId);
      return { tokenIDs, pageKey: nftsResponse.cursor };
    } catch (error) {
      return null;
    }
  }

  public static async getNftType(
    contractAddress: string,
    chainID: number
  ): Promise<NftType> {
    const infura = getInfuraProvider(chainID);
    const nft = await infura.api.getContractMetadata({ contractAddress });
    return this.extractNftType(nft.tokenType);
  }

  private static extractNftType(infuraNftType: string): NftType {
    if (infuraNftType === "ERC1155") return NftType.ERC1155;
    else if (infuraNftType === "ERC721") return NftType.ERC721;
    else return NftType.UNKNOWN;
  }

  private static isERC1155(nft: {
    contract: string;
    tokenId: string;
    supply: string;
    type: string;
    metadata?: { [key: string]: unknown };
  }): boolean {
    return nft.type === NftType.ERC1155;
  }
}
