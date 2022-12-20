import { Injectable } from '@nestjs/common';
import { Alchemy, Nft } from 'alchemy-sdk';

@Injectable()
export class NftService {
  constructor(private readonly alchemy: Alchemy) {}
  // Get all the NFTs owned by an address
  async getNfts(address: string): Promise<Nft[]> {
    return (await this.alchemy.nft.getNftsForOwner(address)).ownedNfts;
  }
}
