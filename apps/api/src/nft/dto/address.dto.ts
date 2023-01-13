import { IsEthereumAddress } from '../../common/validators/is-ethereum-address';

export class Address {
  @IsEthereumAddress()
  address: string;
}
