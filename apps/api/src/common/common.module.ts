import { Module } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
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
      provide: 'CHAIN_PROVIDER',
      useFactory: (req) => chainProvider(req.query.chainId),
      inject: [REQUEST],
    },
    {
      provide: 'ALCHEMY_PROVIDER',
      useFactory: (req) => alchemyProvider(req.query.chainId),
      inject: [REQUEST],
    },
  ],
  exports: [Alchemy, 'CHAIN_PROVIDER', 'ALCHEMY_PROVIDER'],
})
export class CommonModule {}
