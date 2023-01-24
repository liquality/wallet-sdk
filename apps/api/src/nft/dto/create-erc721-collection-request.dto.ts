import { IsString } from 'class-validator';
import { IsEthereumAddress } from '../../common/validators/is-ethereum-address';

export class CreateERC721CollectionRequest {
  @IsString()
  tokenName: string;

  @IsString()
  tokenSymbol: string;

  @IsEthereumAddress()
  creator: string;
}
