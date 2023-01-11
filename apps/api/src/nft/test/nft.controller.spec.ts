import { Test, TestingModule } from '@nestjs/testing';
import { Alchemy } from 'alchemy-sdk';
import { randomBytes } from 'crypto';
import { CommonModule } from '../../common/common.module';
import { NftController } from '../nft.controller';
import { Nft } from '../dto/nft.dto';
import { NftService } from '../nft.service';
import { AlchemyNftProvider } from '../providers/alchemy-nft.provider';
import {
  SAMPLE_ALCHEMY_NFTS,
  SAMPLE_ALCHEMY_NFTS_IN_UNIFIED_FORMAT,
} from './test-data';

describe('NftController', () => {
  let nftController: NftController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NftController],
      providers: [NftService, AlchemyNftProvider],
      imports: [CommonModule],
    }).compile();

    nftController = app.get<NftController>(NftController);

    // Mock Alchemy SDK  - getNftsForOwner function
    const alchemySDK = app.get(Alchemy);
    jest
      .spyOn(alchemySDK.nft, 'getNftsForOwner')
      .mockImplementation(() => Promise.resolve(SAMPLE_ALCHEMY_NFTS as any));
  });

  describe('view nft', () => {
    it('should return nfts', async () => {
      const nfts: Nft[] = await nftController.getNfts(
        randomBytes(20).toString(),
      );
      expect(nfts).toBeDefined();

      // Expect the format of returned NFT to be the unified format
      expect(nfts[0]).toEqual<Nft>(SAMPLE_ALCHEMY_NFTS_IN_UNIFIED_FORMAT);
    });
  });
});
