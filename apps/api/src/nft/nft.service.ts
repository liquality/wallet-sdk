import { PopulatedTransaction } from '@ethersproject/contracts';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Nft, NftType } from './dto/nft.dto';
import { TransferRequest } from './dto/transfer-request.dto';
import { NftContract, NftInfo } from './types';
import { AddressZero } from '@ethersproject/constants';
import { Provider } from '@ethersproject/providers';
import { TransactionService } from '../transaction/transaction.service';
import { NftProvider } from './nft.provider';
import { CreateERC1155CollectionRequest } from './dto/create-erc1155-collection-request.dto';
import { LiqERC1155 } from 'typechain/contracts/nft/LIQ_ERC1155.sol';
import { LiqERC721__factory } from 'typechain/factories/contracts/nft/LIQ_ERC721.sol';
import { ethers } from 'ethers';
import { LiqERC1155__factory } from 'typechain/factories/contracts/nft/LIQ_ERC1155.sol';
import { CreateERC721CollectionRequest } from './dto/create-erc721-collection-request.dto';
import { MintERC1155Request } from './dto/mint-erc1155-request.dto';
import { LiqERC721 } from 'typechain/contracts/nft/LIQ_ERC721.sol';
import { MintERC721Request } from './dto/mint-erc721-request.dto';
import { ERC721 } from 'typechain/@openzeppelin/contracts/token/ERC721/ERC721';
import { ERC1155 } from 'typechain/@openzeppelin/contracts/token/ERC1155/ERC1155';

@Injectable()
export class NftService {
  private liqERC721: LiqERC721;
  private liqERC1155: LiqERC1155;

  private schemas: Record<string, NftContract>;
  private cache: Record<string, NftInfo>;

  constructor(
    private readonly nftProvider: NftProvider,
    private readonly transactionService: TransactionService,
    @Inject('CHAIN_PROVIDER') private readonly chainProvider: Provider,
  ) {
    this.liqERC721 = LiqERC721__factory.connect(
      AddressZero,
      this.chainProvider,
    );
    this.liqERC1155 = LiqERC1155__factory.connect(
      AddressZero,
      this.chainProvider,
    );

    this.cache = {};
    this.schemas = {
      [NftType.ERC721]: this.liqERC721,
      [NftType.ERC1155]: this.liqERC1155,
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

  async createERC1155Collection(
    { uri, creator }: CreateERC1155CollectionRequest,
    chainId: number,
  ): Promise<PopulatedTransaction> {
    const contractFactory = new ethers.ContractFactory(
      LiqERC1155__factory.abi,
      LiqERC1155__factory.bytecode,
    );
    const deployTx = contractFactory.getDeployTransaction(uri);

    return this.transactionService.prepareTransaction({
      data: deployTx.data.toString(),
      from: creator,
      chainId,
      to: AddressZero,
    });
  }

  async mintERC1155Token(
    { contractAddress, owner, recipient, id, amount }: MintERC1155Request,
    chainId: number,
  ): Promise<PopulatedTransaction> {
    const contract = this.liqERC1155.attach(contractAddress);
    const data = '0x';
    const tx = await contract.populateTransaction.mint(
      recipient,
      id,
      amount,
      data,
    );

    return this.transactionService.prepareTransaction({
      ...tx,
      from: owner,
      chainId,
    });
  }

  async createERC721Collection(
    { tokenName, tokenSymbol, creator }: CreateERC721CollectionRequest,
    chainId: number,
  ): Promise<PopulatedTransaction> {
    const contractFactory = new ethers.ContractFactory(
      LiqERC721__factory.abi,
      LiqERC721__factory.bytecode,
    );
    const deployTx = contractFactory.getDeployTransaction(
      tokenName,
      tokenSymbol,
    );

    return this.transactionService.prepareTransaction({
      data: deployTx.data.toString(),
      from: creator,
      chainId,
      to: AddressZero,
    });
  }

  async mintERC721Token(
    { contractAddress, owner, recipient, uri }: MintERC721Request,
    chainId: number,
  ): Promise<PopulatedTransaction> {
    const contract = this.liqERC721.attach(contractAddress);
    const tx = await contract.populateTransaction.safeMint(recipient, uri);

    return this.transactionService.prepareTransaction({
      ...tx,
      from: owner,
      chainId,
    });
  }
}
