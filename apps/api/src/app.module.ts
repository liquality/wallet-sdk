import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NftModule } from './nft/nft.module';
import { CommonModule } from './common/common.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [NftModule, CommonModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
