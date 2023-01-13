import { Injectable } from '@nestjs/common';
import { Nft, NftType } from './dto/nft.dto';
import { AlchemyNftProvider } from './providers/alchemy-nft.provider';
import { BaseNftProvider } from './providers/base-nft.provider';

@Injectable()
export class NftProvider extends BaseNftProvider {
  private nftProviders: BaseNftProvider[] = [];

  constructor(private readonly alchemyNftProvider: AlchemyNftProvider) {
    super();
    this.nftProviders.push(alchemyNftProvider);
  }

  // Get all the NFTs owned by an address
  async getNfts(owner: string): Promise<Nft[]> {
    let nfts: Nft[];

    // Go through each nftProviders until one succeeds.
    for (let i = 0; i < this.nftProviders.length && !nfts; i++) {
      nfts = await this.nftProviders[0].getNfts(owner);
    }

    return nfts;
  }

  public async getNftType(contractAddress: string): Promise<NftType> {
    // Go through each nftProviders until one succeeds.
    let nftType: NftType;

    for (let i = 0; i < this.nftProviders.length && !nftType; i++) {
      nftType = await this.nftProviders[0].getNftType(contractAddress);
    }
    return nftType;
  }
}
