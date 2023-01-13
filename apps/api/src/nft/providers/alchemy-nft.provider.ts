import { Inject, Injectable } from '@nestjs/common';
import { Alchemy, NftTokenType, Nft as AlchemyNft } from 'alchemy-sdk';
import { Nft, NftType } from '../dto/nft.dto';
import { BaseNftProvider } from './base-nft.provider';

@Injectable()
export class AlchemyNftProvider extends BaseNftProvider {
  constructor(@Inject('ALCHEMY_PROVIDER') private readonly alchemy: Alchemy) {
    super();
  }

  public async getNfts(owner: string): Promise<Nft[]> {
    try {
      const nfts = (await this.alchemy.nft.getNftsForOwner(owner)).ownedNfts;

      return nfts.map((nft) => {
        return {
          id: nft.tokenId,
          contract: {
            address: nft.contract.address,
            name: nft.contract.name || '',
            symbol: nft.contract.symbol || '',
            type: this.extractNftType(nft.tokenType) || undefined,
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

  public async getNftType(contractAddress: string): Promise<NftType> {
    const nft = await this.alchemy.nft.getContractMetadata(contractAddress);
    return this.extractNftType(nft.tokenType);
  }

  private extractNftType(alchemyNftType: NftTokenType): NftType {
    if (alchemyNftType === NftTokenType.ERC1155) return NftType.ERC1155;
    else if (alchemyNftType === NftTokenType.ERC721) return NftType.ERC721;
    else return NftType.UNKNOWN;
  }

  private isERC1155(nft: AlchemyNft): boolean {
    return nft.contract.tokenType === NftTokenType.ERC1155;
  }
}
