import { ethers } from "ethers";
import { Config } from "../common/config";

const chainProviderOptions = {
  ...(Config.ALCHEMY_API_KEY && { alchemy: Config.ALCHEMY_API_KEY }),
  ...(Config.ETHERSCAN_API_KEY && { etherscan: Config.ETHERSCAN_API_KEY }),
  ...(Config.INFURA_PROJECT_ID && { infura: Config.INFURA_PROJECT_ID }),
  ...(Config.POCKET_NETWORK_APPLICATION_ID && {
    pocket: Config.POCKET_NETWORK_APPLICATION_ID,
  }),
  ...(Config.QUORUM && {
    quorum: Config.QUORUM,
  }),
};

const chainProviderCache: Record<number, ethers.providers.BaseProvider> = {};
export function getChainProvider(chainId: number) {
  if (chainProviderCache[chainId]) return chainProviderCache[chainId];
  return createChainProvider(chainId);
}

export function createChainProvider(chainId: number) {
  const chainProvider = ethers.getDefaultProvider(
    chainId,
    chainProviderOptions
  );
  chainProviderCache[chainId] = chainProvider;

  return chainProvider;
}
