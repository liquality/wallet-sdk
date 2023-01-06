export interface Nft {
  id: string;
  contract: {
    address: string;
    name?: string;
    symbol?: string;
    type?: NftType;
  };
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
  };
  balance?: number;
}

export enum NftType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}
