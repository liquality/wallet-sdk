import { Nft } from '../nft.interface';

export abstract class BaseNftProvider {
  public abstract getNft(address: string): Promise<Nft[]>;
}
