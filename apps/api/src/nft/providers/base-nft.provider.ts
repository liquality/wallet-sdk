import { Nft } from '../nft.dto';

export abstract class BaseNftProvider {
  public abstract getNfts(address: string): Promise<Nft[]>;
}
