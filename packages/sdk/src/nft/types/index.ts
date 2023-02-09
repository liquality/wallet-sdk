import { LiqERC1155, LiqERC721 } from "../../../typechain-types";
export type NftContract = LiqERC721 | LiqERC1155;
export type NftInfo = { contract: NftContract; schema: NftType };
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
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  UNKNOWN = "UNKNOWN",
}

export interface TransferRequest {
  contractAddress: string;
  owner: string;
  receiver: string;
  tokenIDs: string[];
  amounts?: number[];
}

export interface CreateERC1155CollectionRequest {
  uri: string;
  creator: string;
}

export interface CreateERC721CollectionRequest {
  tokenName: string;
  tokenSymbol: string;
  creator: string;
}

export interface MintERC1155Request {
  contractAddress: string;
  owner: string;
  recipient: string;
  id: string;
  amount: number;
}

export interface MintERC721Request {
  contractAddress: string;
  owner: string;
  recipient: string;
  uri: string;
}
