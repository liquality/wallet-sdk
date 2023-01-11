import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { PopulatedTransaction } from 'ethers';
import { Address } from './dto/address.dto';
import { Nft } from './dto/nft.dto';
import { TransferRequest } from './dto/transfer-request.dto';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @ApiBadRequestResponse()
  @Get(':owner')
  async getNfts(@Param() owner: Address): Promise<Nft[]> {
    return await this.nftService.getNfts(owner.address);
  }

  @ApiBadRequestResponse()
  @Post('/transfer/transaction')
  async populateTransfer(
    @Body() transferRequest: TransferRequest,
  ): Promise<PopulatedTransaction> {
    return await this.nftService.populateTransfer(transferRequest);
  }
}
