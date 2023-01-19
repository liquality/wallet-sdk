import { IsString } from 'class-validator';

export class SignedTransaction {
  @IsString()
  tx: string;
}
