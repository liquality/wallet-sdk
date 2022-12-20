import { Module } from '@nestjs/common';
import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

@Module({
  providers: [
    {
      provide: Alchemy,
      useValue: new Alchemy(settings),
    },
  ],
  exports: [Alchemy],
})
export class CommonModule {}
