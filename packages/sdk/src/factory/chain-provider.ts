import { ethers, providers } from "ethers";
import { CHAINS, CHAIN_IDS } from "../common/constants";
import { Config } from "../common/config";
import { ExternalProvider, JsonRpcProvider, BaseProvider, Web3Provider } from "@ethersproject/providers";


const chainProviderCache: Record<number, BaseProvider> = {};

export async function getChainProvider(chainId: number, provider?: ExternalProvider): Promise<BaseProvider | Web3Provider> {
  if(provider) return new Web3Provider(provider);
  return chainProviderCache[chainId] ? chainProviderCache[chainId] : createChainProvider(chainId);
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
  } else if (chainId === CHAIN_IDS.MATIC_MUMBAI) {
    chainProvider = new ethers.providers.JsonRpcProvider(CHAINS[chainId].providerRPCs.ALCHEMY+Config.ALCHEMY_API_KEY , 80001);
  } 
  else {
    chainProvider = ethers.getDefaultProvider(
      chainId,
      chainProviderOptions
    );
  }

  chainProviderCache[chainId] = chainProvider;
  return chainProvider
}
