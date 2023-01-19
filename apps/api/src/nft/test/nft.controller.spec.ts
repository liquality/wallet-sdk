import { Test, TestingModule } from '@nestjs/testing';
import { NftController } from '../nft.controller';
import { Nft } from '../dto/nft.dto';
import { NftService } from '../nft.service';
import { AlchemyNftProvider } from '../providers/alchemy-nft.provider';
import {
  MockCommonModule,
  SAMPLE_ALCHEMY_NFTS_IN_UNIFIED_FORMAT,
  SAMPLE_AVG_FEES,
  SAMPLE_GAS_LIMIT,
} from './test-data';
import { AddressZero } from '@ethersproject/constants';
import { TransferRequest } from '../dto/transfer-request.dto';
import { CHAIN_IDS } from '../../common/chain-ids';
import { PopulatedTransaction } from 'ethers';
import { NftProvider } from '../nft.provider';
import * as dotenv from 'dotenv';
dotenv.config();

import { TransactionService } from '../../transaction/transaction.service';

describe('NftController', () => {
  let nftService: NftService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NftController],
      providers: [
        NftService,
        AlchemyNftProvider,
        NftProvider,
        TransactionService,
      ],
      imports: [MockCommonModule],
    }).compile();

    nftService = app.get<NftService>(NftService);
  });

  it('should return nfts for a given address', async () => {
    const nfts: Nft[] = await nftService.getNfts(AddressZero);
    expect(nfts).toBeDefined();

    // Expect the format of returned NFT to be the unified format
    expect(nfts[0]).toEqual<Nft>(SAMPLE_ALCHEMY_NFTS_IN_UNIFIED_FORMAT);
  });

  it('should return unsigned-transaction for a transfer request', async () => {
    const transferRequest: TransferRequest = {
      contractAddress: AddressZero,
      owner: AddressZero,
      receiver: AddressZero,
      tokenIDs: ['2'],
    };
    const populatedTransfer: PopulatedTransaction =
      await nftService.populateTransfer(transferRequest, CHAIN_IDS.ETH_MAINNET);

    expect(populatedTransfer.to).toEqual(AddressZero);
    expect(populatedTransfer.from).toEqual(AddressZero);
    expect(populatedTransfer.chainId).toEqual(CHAIN_IDS.ETH_MAINNET);
    expect(populatedTransfer.nonce).toEqual(0);
    expect(populatedTransfer.type).toEqual(2);
    expect(populatedTransfer.type).toEqual(2);
    expect(populatedTransfer.gasLimit.eq(SAMPLE_GAS_LIMIT)).toBeTruthy();
    expect(
      populatedTransfer.maxFeePerGas.eq(SAMPLE_AVG_FEES.maxFeePerGas),
    ).toBeTruthy();
    expect(
      populatedTransfer.maxPriorityFeePerGas.eq(
        SAMPLE_AVG_FEES.maxPriorityFeePerGas,
      ),
    ).toBeTruthy();
  });
});
