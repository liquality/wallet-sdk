import { ethers } from "ethers";
import { CHAIN_IDS } from "../common/chain-ids";
import { Config } from "../common/config";


const chainProviderCache: Record<number, ethers.providers.BaseProvider> = {};
export function getChainProvider(chainId: number) {
  if (chainProviderCache[chainId]) return chainProviderCache[chainId];
  return createChainProvider(chainId);
}

export function createChainProvider(chainId: number) {
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

  let chainProvider;
  if (chainId === CHAIN_IDS.BNB_MAINNET) {
    chainProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/', 56);
  } else {
    chainProvider = ethers.getDefaultProvider(
      chainId,
      chainProviderOptions
    );
  }


  chainProviderCache[chainId] = chainProvider;

  return chainProvider;
}
