import {
  BaseProvider,
  FeeData,
  Network,
  Networkish,
} from '@ethersproject/providers';
import { Module } from '@nestjs/common';
import { Alchemy, NftTokenType } from 'alchemy-sdk';
import { BigNumber } from 'ethers';
import { NftType } from '../dto/nft.dto';

const alchemyNft = {
  contract: {
    address: '0x000386e3f7559d9b6a2f5c46b4ad1a9587d59dc3',
    name: 'Bored Ape Nike Club',
    symbol: 'BANC',
    tokenType: 'ERC721',
    openSea: {
      collectionName: 'BoredApeNikeClub',
      safelistRequestStatus: 'not_requested',
      imageUrl:
        'https://i.seadn.io/gae/yJ9DgXqjRwgdCkrQmHj7krCbixM8fPVAyYJWJ5NHXap1L0c3QL5MPvrNT0QDINIStGOK857lOvab8MpNQS9X4pkHPktmhVmN82qoVw?w=500&auto=format',
      description:
        'COUNTDOWN OVER. MINTING LIVE.\n\n[Mint on the website.](https://nikemetaverse.xyz)\n',
      externalUrl: 'https://nikemetaverse.xyz',
      lastIngestedAt: '2023-01-07T10:51:55.000Z',
    },
  },
  tokenId: '377',
  tokenType: 'ERC721',
  title: '',
  description: '',
  timeLastUpdated: '2023-01-09T14:43:47.895Z',
  metadataError: 'Token does not exist',
  rawMetadata: {
    metadata: [],
    attributes: [],
  },
  media: [],
  spamInfo: {
    isSpam: true,
    classifications: [
      'OwnedByMostHoneyPots',
      'Erc721TooManyOwners',
      'Erc721TooManyTokens',
    ],
  },
  balance: 1,
};

export const SAMPLE_ALCHEMY_NFTS = {
  ownedNfts: [alchemyNft],
};

export const SAMPLE_FEE_DATA: FeeData = {
  gasPrice: BigNumber.from(1000),
  maxFeePerGas: BigNumber.from(2000),
  maxPriorityFeePerGas: BigNumber.from(500),
  lastBaseFeePerGas: null,
};

export const SAMPLE_AVG_FEES = {
  maxFeePerGas: BigNumber.from(3000),
  maxPriorityFeePerGas: BigNumber.from(750),
};

export const SAMPLE_GAS_ESTIMATE = BigNumber.from(30000);
export const SAMPLE_GAS_LIMIT = BigNumber.from(36000);

export const SAMPLE_TRANSACTION_COUNT = 0;

export const SAMPLE_ALCHEMY_NFTS_IN_UNIFIED_FORMAT = {
  id: alchemyNft.tokenId,
  contract: {
    address: alchemyNft.contract.address,
    name: alchemyNft.contract.name || '',
    symbol: alchemyNft.contract.symbol || '',
    type: NftType.ERC721,
  },
  metadata: {
    name: '',
    description: '',
    image: '',
  },
};

export class MockAlchemyProvider extends Alchemy {
  public nft;
  constructor(chainID) {
    super(chainID);

    this.nft = {
      getNftsForOwner: () => this.getNftsForOwner(),
      getContractMetadata: () =>
        Promise.resolve({ tokenType: NftTokenType.ERC721 }),
    };
  }
  public async getNftsForOwner() {
    return Promise.resolve(SAMPLE_ALCHEMY_NFTS as any);
  }
}

export class MockChainProvider extends BaseProvider {
  constructor(chainId: Networkish | Promise<Network>) {
    super(chainId);
  }
  public getFeeData() {
    return Promise.resolve(SAMPLE_FEE_DATA);
  }
  public estimateGas() {
    return Promise.resolve(SAMPLE_GAS_ESTIMATE);
  }
  public getTransactionCount() {
    return Promise.resolve(SAMPLE_TRANSACTION_COUNT);
  }
}

@Module({
  providers: [
    {
      provide: 'CHAIN_PROVIDER',
      useValue: new MockChainProvider(137),
    },
    {
      provide: 'ALCHEMY_PROVIDER',
      useValue: new MockAlchemyProvider(137),
    },
  ],
  exports: ['CHAIN_PROVIDER', 'ALCHEMY_PROVIDER'],
})
export class MockCommonModule {}
