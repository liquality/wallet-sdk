import { Controller, Get, Param } from '@nestjs/common';
import { Nft } from './nft.interface';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get(':address')
  async getNfts(@Param('address') address: string): Promise<Nft[]> {
    return await this.nftService.getNfts(address);
  }
}
