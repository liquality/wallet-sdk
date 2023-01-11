import { Alchemy, Network } from 'alchemy-sdk';
import { ALCHEMY_API_KEY } from './api-keys';

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

export default new Alchemy(settings);
