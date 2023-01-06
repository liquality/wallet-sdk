import { Nft } from '../nft.dto';

export abstract class BaseNftProvider {
  public abstract getNfts(owner: string): Promise<Nft[]>;
}
