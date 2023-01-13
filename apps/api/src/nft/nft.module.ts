import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { NftController } from './nft.controller';
import { NftProvider } from './nft.provider';
import { NftService } from './nft.service';
import { AlchemyNftProvider } from './providers/alchemy-nft.provider';

@Module({
  providers: [NftService, AlchemyNftProvider, NftProvider],
  controllers: [NftController],
  imports: [CommonModule, TransactionModule],
})
export class NftModule {}
