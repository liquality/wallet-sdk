import { DebridgeSwapProviderConfig } from "./types";

export const DebridgeConfig: DebridgeSwapProviderConfig = {
  url: "https://deswap.debridge.finance/v1.0/",
  api: "https://api.debridge.finance/api/",
  routerAddress: "0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251",
  chains: {
    1: {
      signatureVerifier: "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c",
      minBlockConfirmation: 12,
    },
    56: {
      signatureVerifier: "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c",
      minBlockConfirmation: 12,
    },
    42161: {
      signatureVerifier: "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c",
      minBlockConfirmation: 12,
    },
    137: {
      signatureVerifier: "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c",
      minBlockConfirmation: 256,
    },
    43114: {
      signatureVerifier: "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c",
      minBlockConfirmation: 12,
    },
  },
};
