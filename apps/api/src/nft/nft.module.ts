import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  providers: [NftService],
  controllers: [NftController],
  imports: [CommonModule],
})
export class NftModule {}
