import { IsNumberString, IsNumber, Min } from 'class-validator';
import { IsEthereumAddress } from '../../common/validators/is-ethereum-address';

export class MintERC1155Request {
  @IsEthereumAddress()
  contractAddress: string;

  @IsEthereumAddress()
  owner: string;

  @IsEthereumAddress()
  recipient: string;

  @IsNumberString()
  id: string;

  @IsNumber()
  @Min(1)
  amount: number
}
