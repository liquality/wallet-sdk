export interface TransferERC20Request {
    contractAddress: string;  
    owner: string;
    receiver: string;
    amount: number;
  }