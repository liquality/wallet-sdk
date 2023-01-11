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
