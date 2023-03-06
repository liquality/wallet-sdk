import { ethers } from "ethers";
import { CHAINS, CHAIN_IDS } from "../common/constants";
import { Config } from "../common/config";
import {Biconomy} from "@biconomy/mexa";
import { PKeyOrProvider } from "../types";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { ExternalProvider } from "@ethersproject/providers";

type ProviderCache = {
  gasless: ethers.providers.BaseProvider
  gasful: ethers.providers.BaseProvider
}
type ChainProvider = ethers.providers.BaseProvider | ethers.providers.Web3Provider

const chainProviderCache: Record<number, ProviderCache> = {};

export function getChainProvider(chainId: number, pKeyOrProvider?: PKeyOrProvider, isGasless?: boolean) : ChainProvider {
  if (chainProviderCache[chainId]) return (isGasless)? chainProviderCache[chainId].gasless : chainProviderCache[chainId].gasful ;
  return createChainProvider(chainId, isGasless, pKeyOrProvider);
}

export function createChainProvider(chainId: number, isGasless?: boolean, pKeyOrProvider?: PKeyOrProvider) : ChainProvider {
  if (isGasless) {
    return gaslessProvider(chainId, pKeyOrProvider!)
  } 
  return gasfulProvider(chainId)
}

function gaslessProvider(chainId: number, pKeyOrProvider: PKeyOrProvider) {
  let chainProvider;
  let provider = CHAINS[chainId].providerRPCs.ALCHEMY+Config.ALCHEMY_API_KEY || 
  CHAINS[chainId].providerRPCs.INFURA+Config.INFURA_PROJECT_ID

  if (typeof pKeyOrProvider == "string") {
    chainProvider = new HDWalletProvider(pKeyOrProvider, provider) as ExternalProvider;  
  } else {
    chainProvider = pKeyOrProvider
  }

  let biconomyOption = {
    apiKey: Config.BICONOMY_API_KEY,
    contractAddresses: []
  } 

  const biconomy = new Biconomy(chainProvider, biconomyOption);
  let biconomyProvider = new ethers.providers.Web3Provider(biconomy.provider);

  chainProviderCache[chainId] = {...chainProviderCache[chainId], gasful: biconomyProvider};
  return biconomyProvider
}

function gasfulProvider(chainId: number): ChainProvider {
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

  chainProviderCache[chainId] = {...chainProviderCache[chainId], gasless: chainProvider};
  return chainProvider
}