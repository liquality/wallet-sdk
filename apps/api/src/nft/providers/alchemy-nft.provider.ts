import { Injectable } from '@nestjs/common';
import { Alchemy, NftTokenType, Nft as AlchemyNft } from 'alchemy-sdk';
import { Nft, NftType } from '../nft.dto';
import { BaseNftProvider } from './base-nft.provider';

@Injectable()
export class AlchemyNftProvider extends BaseNftProvider {
  constructor(private readonly alchemy: Alchemy) {
    super();
  }

  public async getNfts(address: string): Promise<Nft[]> {
    try {
      const nfts = (await this.alchemy.nft.getNftsForOwner(address)).ownedNfts;
      return nfts.map((nft) => {
        return {
          id: nft.tokenId,
          contract: {
            address: nft.contract.address,
            name: nft.contract.name || '',
            symbol: nft.contract.symbol || '',
            type: this.getNftType(nft) || undefined,
          },
          metadata: {
            name: nft.rawMetadata.name || '',
            description: nft.rawMetadata.description || '',
            image: nft.rawMetadata.image || '',
          },
          balance: this.isERC1155(nft) ? nft.balance : undefined,
        };
      });
    } catch (error) {
      return null;
    }
  }

  private getNftType(nft: AlchemyNft): NftType {
    if (nft.contract.tokenType === NftTokenType.ERC1155) return NftType.ERC1155;
    else if (nft.contract.tokenType === NftTokenType.ERC721)
      return NftType.ERC721;
    else return null;
  }

  private isERC1155(nft: AlchemyNft): boolean {
    return nft.contract.tokenType === NftTokenType.ERC1155;
  }
}
