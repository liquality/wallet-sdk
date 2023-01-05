import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NftModule } from './nft/nft.module';
import { AuthModule } from './auth/auth.module';

import { CommonModule } from './common/common.module';

@Module({
  imports: [NftModule, CommonModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
