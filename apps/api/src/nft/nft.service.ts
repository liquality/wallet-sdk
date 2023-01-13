import { PopulatedTransaction } from '@ethersproject/contracts';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  ERC1155,
  ERC1155__factory,
  ERC721,
  ERC721__factory,
} from '../../typechain';
import { Nft, NftType } from './dto/nft.dto';
import { AlchemyNftProvider } from './providers/alchemy-nft.provider';
import { BaseNftProvider } from './providers/base-nft.provider';
import { TransferRequest } from './dto/transfer-request.dto';
import { NftContract, NftInfo } from './types';
import { AddressZero } from '@ethersproject/constants';
import { Provider } from '@ethersproject/providers';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class NftService {
  private nftProviders: BaseNftProvider[] = [];
  private _erc721: ERC721;
  private _erc1155: ERC1155;

  private schemas: Record<string, NftContract>;
  private cache: Record<string, NftInfo>;

  constructor(
    private readonly transactionService: TransactionService,
    @Inject('CHAIN_PROVIDER') private readonly chainProvider: Provider,
  ) {
    this.nftProviders.push(alchemyNftProvider);
    this._erc721 = ERC721__factory.connect(AddressZero, this.chainProvider);
    this._erc1155 = ERC1155__factory.connect(AddressZero, this.chainProvider);
    this.cache = {};
    this.schemas = {
      [NftType.ERC721]: this._erc721,
      [NftType.ERC1155]: this._erc1155,
    };
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

  async populateTransfer(
    transferRequest: TransferRequest,
    chainId: number,
  ): Promise<PopulatedTransaction> {
    const { contractAddress, owner, receiver, tokenIDs, amounts } =
      transferRequest;
    const { schema, contract } = await this.cacheGet(contractAddress);

    let tx: PopulatedTransaction;
    const data = '0x';

    switch (schema) {
      case NftType.ERC721: {
        if (tokenIDs.length !== 1) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: `ERC 721 transfer supports exactly 1 tokenID, received ${tokenIDs.join(
              ', ',
            )}`,
            error: 'Bad Request',
          });
        }
        const _contract: ERC721 = contract as ERC721;
        tx = await _contract.populateTransaction[
          'safeTransferFrom(address,address,uint256)'
        ](owner, receiver, tokenIDs[0]);
        break;
      }

      case NftType.ERC1155: {
        const _contract: ERC1155 = contract as ERC1155;
        if (tokenIDs.length > 1) {
          tx = await _contract.populateTransaction.safeBatchTransferFrom(
            owner,
            receiver,
            tokenIDs,
            amounts,
            data,
          );
        } else {
          tx = await _contract.populateTransaction.safeTransferFrom(
            owner,
            receiver,
            tokenIDs[0],
            amounts[0],
            data,
          );
        }
        break;
      }

      default: {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Unsupported NFT type: ${schema}`,
          error: 'Bad Request',
        });
      }
    }

    return this.transactionService.prepareTransaction({
      ...tx,
      from: transferRequest.owner,
      chainId,
    });
  }

  private async cacheGet(contractAddress: string): Promise<NftInfo> {
    const _contractAddress = contractAddress.toString();

    if (this.cache[_contractAddress]) {
      return this.cache[_contractAddress];
    }
    const ERC721_INTERFACE = {
      id: '0x80ac58cd',
      type: NftType.ERC721,
    };
    const ERC1155_INTERFACE = {
      id: '0xd9b67a26',
      type: NftType.ERC1155,
    };

    for (const _interface of [ERC721_INTERFACE, ERC1155_INTERFACE]) {
      // we can use erc721 because both erc721 and erc1155 implement supportsInterface
      const isSupported = await this._erc721
        .attach(_contractAddress)
        .supportsInterface(_interface.id);

      if (isSupported) {
        this.cache[_contractAddress] = {
          contract: this.schemas[_interface.type].attach(_contractAddress),
          schema: _interface.type,
        };

        return this.cache[_contractAddress];
      }
    }

    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `${_contractAddress} is not an NFT contract`,
      error: 'Bad Request',
    });
  }
}
