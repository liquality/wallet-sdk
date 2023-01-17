import { Module } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import alchemyProvider from './alchemy-provider';
import chainProvider from './chain-provider';

@Module({
  providers: [
    {
      provide: 'CHAIN_PROVIDER',
      useFactory: (req) => chainProvider(parseInt(req.query.chainId)),
      inject: [REQUEST],
    },
    {
      provide: 'ALCHEMY_PROVIDER',
      useFactory: (req) => alchemyProvider(parseInt(req.query.chainId)),
      inject: [REQUEST],
    },
  ],
  exports: ['CHAIN_PROVIDER', 'ALCHEMY_PROVIDER'],
})
export class CommonModule {}
