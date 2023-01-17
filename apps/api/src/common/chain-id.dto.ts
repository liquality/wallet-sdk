import { Type } from 'class-transformer';
import { IsIn, IsNumber } from 'class-validator';
import { CHAIN_IDS } from './chain-ids';

export class ChainId {
  @IsNumber()
  @IsIn(Object.values(CHAIN_IDS))
  @Type(() => Number)
  chainId: number;
}
