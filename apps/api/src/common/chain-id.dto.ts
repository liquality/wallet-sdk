import { IsIn, IsNumberString } from 'class-validator';
import { CHAIN_IDS } from './chain-ids';

export class ChainId {
  @IsNumberString()
  @IsIn(Object.values(CHAIN_IDS))
  chainId: string;
}
