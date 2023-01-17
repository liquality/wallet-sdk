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
import { TransferRequest } from './dto/transfer-request.dto';
import { NftContract, NftInfo } from './types';
import { AddressZero } from '@ethersproject/constants';
import { Provider } from '@ethersproject/providers';
import { TransactionService } from '../transaction/transaction.service';
import { NftProvider } from './nft.provider';

@Injectable()
export class NftService {
  private _erc721: ERC721;
  private _erc1155: ERC1155;

  private schemas: Record<string, NftContract>;
  private cache: Record<string, NftInfo>;

  constructor(
    private readonly nftProvider: NftProvider,
    private readonly transactionService: TransactionService,
    @Inject('CHAIN_PROVIDER') private readonly chainProvider: Provider,
  ) {
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
    return this.nftProvider.getNfts(owner);
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
    if (this.cache[contractAddress]) {
      return this.cache[contractAddress];
    }

    const nftType = await this.nftProvider.getNftType(contractAddress);

    if (nftType !== NftType.UNKNOWN) {
      this.cache[contractAddress] = {
        contract: this.schemas[nftType].attach(contractAddress),
        schema: nftType,
      };

      return this.cache[contractAddress];
    }

    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `${contractAddress} is not an NFT contract`,
      error: 'Bad Request',
    });
  }
}
