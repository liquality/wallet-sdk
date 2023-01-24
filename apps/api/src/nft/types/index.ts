import { LiqERC1155 } from 'typechain/contracts/nft/LIQ_ERC1155.sol';
import { LiqERC721 } from 'typechain/contracts/nft/LIQ_ERC721.sol';
import { NftType } from '../dto/nft.dto';

export type NftContract = LiqERC721 | LiqERC1155;
export type NftInfo = { contract: NftContract; schema: NftType };
