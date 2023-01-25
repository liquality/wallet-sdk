import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { PopulatedTransaction } from 'ethers';
import { ChainId } from '../common/chain-id.dto';
import { Address } from './dto/address.dto';
import { CreateERC1155CollectionRequest } from './dto/create-erc1155-collection-request.dto';
import { CreateERC721CollectionRequest } from './dto/create-erc721-collection-request.dto';
import { MintERC1155Request } from './dto/mint-erc1155-request.dto';
import { MintERC721Request } from './dto/mint-erc721-request.dto';
import { Nft } from './dto/nft.dto';
import { TransferRequest } from './dto/transfer-request.dto';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) { }

  @ApiBadRequestResponse()
  @Get('collectibles/:address')
  async getNfts(
    @Param() owner: Address,
    @Query() chainId: ChainId,
  ): Promise<Nft[]> {
    ~chainId;
    return await this.nftService.getNfts(owner.address);
  }

  @ApiBadRequestResponse()
  @Post('/transfer/unsigned-transactions')
  async populateTransfer(
    @Body() transferRequest: TransferRequest,
    @Query() query: ChainId,
  ): Promise<PopulatedTransaction> {
    return await this.nftService.populateTransfer(
      transferRequest,
      +query.chainId,
    );
  }

  @ApiBadRequestResponse()
  @Post('erc1155/deployment/unsigned-transactions')
  async create1155Collection(
    @Body() creationRequest: CreateERC1155CollectionRequest,
    @Query() query: ChainId,
  ): Promise<PopulatedTransaction> {
    return await this.nftService.createERC1155Collection(creationRequest,+query.chainId);
  }

  @ApiBadRequestResponse()
  @Post('erc1155/mint/unsigned-transactions')
  async mintERC1155Token(
    @Body() mintRequest: MintERC1155Request,
    @Query() query: ChainId,
  ): Promise<PopulatedTransaction> {
    return await this.nftService.mintERC1155Token(mintRequest,+query.chainId);
  }

  @ApiBadRequestResponse()
  @Post('erc721/deployment/unsigned-transactions')
  async create721Collection(
    @Body() creationRequest: CreateERC721CollectionRequest,
    @Query() query: ChainId,
  ): Promise<PopulatedTransaction> {
    return await this.nftService.createERC721Collection(creationRequest,+query.chainId);
  }

  @ApiBadRequestResponse()
  @Post('erc721/mint/unsigned-transactions')
  async mintErC721Token(
    @Body() mintRequest: MintERC721Request,
    @Query() query: ChainId,
  ): Promise<PopulatedTransaction> {
    return await this.nftService.mintERC721Token(mintRequest,+query.chainId);
  }
}
