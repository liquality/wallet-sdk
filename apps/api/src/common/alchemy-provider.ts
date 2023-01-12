import { Alchemy, Network } from 'alchemy-sdk';
import { ALCHEMY_API_KEY } from './api-keys';
import { CHAIN_IDS } from './chain-ids';

const chainIdToNetwork = {
  [CHAIN_IDS.ETH_MAINNET]: Network.ETH_MAINNET,
  [CHAIN_IDS.ETH_GOERLI]: Network.ETH_GOERLI,
  [CHAIN_IDS.OPT_MAINNET]: Network.OPT_MAINNET,
  [CHAIN_IDS.OPT_GOERLI]: Network.OPT_GOERLI,
  [CHAIN_IDS.ARB_MAINNET]: Network.ARB_MAINNET,
  [CHAIN_IDS.ARB_GOERLI]: Network.ARB_GOERLI,
  [CHAIN_IDS.MATIC_MAINNET]: Network.MATIC_MAINNET,
  [CHAIN_IDS.MATIC_MUMBAI]: Network.MATIC_MUMBAI,
  [CHAIN_IDS.ASTAR_MAINNET]: Network.ASTAR_MAINNET,
};

export default (chainId: string) => {
  const settings = {
    apiKey: ALCHEMY_API_KEY,
    network: chainIdToNetwork[Number(chainId).valueOf()],
  };
  return new Alchemy(settings);
};
