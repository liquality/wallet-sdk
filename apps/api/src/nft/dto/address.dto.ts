import { IsEthereumAddress } from 'class-validator';

export class Address {
  @IsEthereumAddress()
  address: string;
}
