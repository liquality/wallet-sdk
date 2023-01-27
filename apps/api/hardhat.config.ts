/** @type import('hardhat/config').HardhatUserConfig */

import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/types/config';

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  typechain: {
    outDir: './typechain',
    target: 'ethers-v5',
  },
};

export default config;
