import { Injectable } from '@nestjs/common';
import { Alchemy } from 'alchemy-sdk';
import { Nft } from '../nft.interface';
import { BaseNftProvider } from './base-nft.provider';

@Injectable()
export class AlchemyNftProvider extends BaseNftProvider {
  constructor(private readonly alchemy: Alchemy) {
    super();
  }

  public async getNft(address: string): Promise<Nft[]> {
    try {
      return (await this.alchemy.nft.getNftsForOwner(address)).ownedNfts;
    } catch (error) {
      return null;
    }
  }
}
