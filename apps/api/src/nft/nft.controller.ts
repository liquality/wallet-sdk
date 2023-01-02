import { Controller, Get, Param } from '@nestjs/common';
import { Nft } from 'alchemy-sdk';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) { }

  @Get(':address')
  async getNfts(@Param('address') address: string): Promise<Nft[]> {
    console.log('Got into NFT controller, endpoint calls class')
    return await this.nftService.getNfts(address);
  }
}
