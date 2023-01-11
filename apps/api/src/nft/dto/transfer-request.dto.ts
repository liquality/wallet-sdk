export class TransferRequest {
  contractAddress: string;
  owner: string;
  receiver: string;
  tokenIDs: string[];
  amounts?: number[];
}
