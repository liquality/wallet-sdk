import { Controller, Get, Param } from '@nestjs/common';
import { Nft } from './nft.dto';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get(':owner')
  async getNfts(@Param('owner') owner: string): Promise<Nft[]> {
    return await this.nftService.getNfts(owner);
  }
}
