import { Nft, NftType } from '../dto/nft.dto';

export abstract class BaseNftProvider {
  public abstract getNfts(owner: string): Promise<Nft[]>;

  public abstract getNftType(contractAddress: string): Promise<NftType>;
}
