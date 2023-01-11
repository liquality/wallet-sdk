import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PopulatedTransaction } from 'ethers';
import { Nft } from './dto/nft.dto';
import { TransferRequest } from './dto/transfer-request.dto';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get(':owner')
  async getNfts(@Param('owner') owner: string): Promise<Nft[]> {
    return await this.nftService.getNfts(owner);
  }

  @Post('/transfer/transaction')
  async populateTransfer(
    @Body() transferRequest: TransferRequest,
  ): Promise<PopulatedTransaction> {
    return await this.nftService.populateTransfer(transferRequest);
  }
}
