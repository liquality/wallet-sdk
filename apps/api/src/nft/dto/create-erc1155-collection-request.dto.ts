import { IsString, IsBoolean } from 'class-validator';
import { IsEthereumAddress } from '../../common/validators/is-ethereum-address';

export class CreateERC1155CollectionRequest {
  @IsString()
  uri: string;

  @IsEthereumAddress()
  creator: string;
}
