export interface SwapRequest {
  srcChainId: number;
  srcChainTokenIn: string;
  srcChainTokenInAmount: string;
  dstChainId: number;
  dstChainTokenOut: string;
  dstChainTokenOutRecipient: string;
}

export interface QuoteRequest {
  srcChainId: number;
  srcChainTokenIn: string;
  srcChainTokenInAmount: string;
  dstChainId: number;
  dstChainTokenOut: string;
}

export interface SwapStatusRequest {
  txHash: string;
  srcChainId: number;
  dstChainId: number;
}

export interface DebridgeSwapProviderConfig {
  url: string;
  api: string;
  routerAddress: string;
  chains: {
    [key in number]: {
      signatureVerifier: string;
      minBlockConfirmation: number;
    };
  };
}

export interface FullSubmissionInfo {
  claim: {
    transactionHash: string;
  };
  send: {
    isExecuted: boolean;
  };
}
