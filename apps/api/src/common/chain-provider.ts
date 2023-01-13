import { ethers } from 'ethers';
import {
  ALCHEMY_API_KEY,
  ETHERSCAN_API_KEY,
  INFURA_PROJECT_ID,
  POCKET_NETWORK_APPLICATION_ID,
} from './api-keys';

const QUORUM = process.env.QUORUM;
const chainProviderOptions = {
  ...(ALCHEMY_API_KEY && { alchemy: ALCHEMY_API_KEY }),
  ...(ETHERSCAN_API_KEY && { etherscan: ETHERSCAN_API_KEY }),
  ...(INFURA_PROJECT_ID && { infura: INFURA_PROJECT_ID }),
  ...(POCKET_NETWORK_APPLICATION_ID && {
    pocket: POCKET_NETWORK_APPLICATION_ID,
  }),
  ...(QUORUM && {
    quorum: QUORUM,
  }),
};

export default (chainId: number) => {
  return ethers.getDefaultProvider(chainId, chainProviderOptions);
};
