import { IsString } from 'class-validator';
import { IsEthereumAddress } from '../../common/validators/is-ethereum-address';

export class MintERC721Request {
  @IsEthereumAddress()
  contractAddress: string;

  @IsEthereumAddress()
  owner: string;

  @IsEthereumAddress()
  recipient: string;

  @IsString()
  uri: string;
}
