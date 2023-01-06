import { Nft } from '../nft.interface';

export abstract class BaseNftProvider {
  public abstract getNfts(address: string): Promise<Nft[]>;
}
