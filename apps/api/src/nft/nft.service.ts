import { Injectable } from '@nestjs/common';
import { Nft } from './nft.interface';
import { AlchemyNftProvider } from './providers/alchemy-nft.provider';
import { BaseNftProvider } from './providers/base-nft.provider';

@Injectable()
export class NftService {
  private nftProviders: BaseNftProvider[] = [];

  constructor(private readonly alchemyNftProvider: AlchemyNftProvider) {
    this.nftProviders.push(alchemyNftProvider);
  }

  // Get all the NFTs owned by an address
  async getNfts(address: string): Promise<Nft[]> {
    let nfts: Nft[];

    // Go through each nftProviders until one succeeds.
    for (let i = 0; i < this.nftProviders.length && !nfts; i++) {
      nfts = await this.nftProviders[0].getNft(address);
    }

    return nfts;
  }
}
