import { Nft } from '../dto/nft.dto';

export abstract class BaseNftProvider {
  public abstract getNfts(owner: string): Promise<Nft[]>;
}
