import { Provider } from '@ethersproject/providers';
import { Module } from '@nestjs/common';
import { Alchemy } from 'alchemy-sdk';
import alchemyProvider from './alchemy-provider';
import chainProvider from './chain-provider';

@Module({
  providers: [
    {
      provide: Alchemy,
      useValue: alchemyProvider,
    },
    {
      provide: Provider,
      useValue: chainProvider,
    },
  ],
  exports: [Alchemy, Provider],
})
export class CommonModule {}
