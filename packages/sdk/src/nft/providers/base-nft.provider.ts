import { NftsForContract, NftType } from "../types";
import { Nft } from "../types";

export abstract class BaseNftProvider {
  public abstract getNfts(
    owner: string,
    chainID: number
  ): Promise<Nft[] | null>;

  public abstract getNftType(
    contractAddress: string,
    chainID: number
  ): Promise<NftType>;

  public abstract getNftsForContract(
    contractAddress: string,
    chainID: number,
    options?: {pageKey?: string, pageSize?: number}
  ): Promise<NftsForContract | null>;
}
