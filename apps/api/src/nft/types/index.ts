import { ERC1155, ERC721 } from 'typechain';
import { NftType } from '../dto/nft.dto';

export type NftContract = ERC721 | ERC1155;
export type NftInfo = { contract: NftContract; schema: NftType };
