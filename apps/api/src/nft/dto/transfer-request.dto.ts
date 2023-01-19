import {
  IsNumberString,
  IsNumber,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { IsEthereumAddress } from '../../common/validators/is-ethereum-address';

export class TransferRequest {
  @IsEthereumAddress()
  contractAddress: string;

  @IsEthereumAddress()
  owner: string;

  @IsEthereumAddress()
  receiver: string;

  @IsNumberString(null, {
    each: true,
  })
  @ArrayNotEmpty()
  tokenIDs: string[];

  @IsOptional()
  @IsNumber(null, {
    each: true,
  })
  @ArrayNotEmpty()
  amounts?: number[];
}
