import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { AlchemyNftProvider } from './providers/alchemy-nft.provider';

@Module({
  providers: [NftService, AlchemyNftProvider],
  controllers: [NftController],
  imports: [CommonModule, TransactionModule],
})
export class NftModule {}
