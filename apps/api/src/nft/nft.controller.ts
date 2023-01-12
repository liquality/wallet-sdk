import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { PopulatedTransaction } from 'ethers';
import { ChainId } from 'src/common/chain-id.dto';
import { Address } from './dto/address.dto';
import { Nft } from './dto/nft.dto';
import { TransferRequest } from './dto/transfer-request.dto';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @ApiBadRequestResponse()
  @Get(':address')
  async getNfts(
    @Param() owner: Address,
    @Query() chainId: ChainId,
  ): Promise<Nft[]> {
    ~chainId;
    return await this.nftService.getNfts(owner.address);
  }

  @ApiBadRequestResponse()
  @Post('/transfer/transaction')
  async populateTransfer(
    @Body() transferRequest: TransferRequest,
    @Query() chainId: ChainId,
  ): Promise<PopulatedTransaction> {
    ~chainId;
    return await this.nftService.populateTransfer(transferRequest);
  }
}
