export const CHAIN_IDS = {
  ETH_MAINNET: 1,
  ETH_GOERLI: 5,
  OPT_MAINNET: 10,
  OPT_GOERLI: 420,
  ARB_MAINNET: 42161,
  ARB_GOERLI: 421613,
  MATIC_MAINNET: 137,
  MATIC_MUMBAI: 80001,
  ASTAR_MAINNET: 592,
  BNB_MAINNET: 56,
};

export const CHAINS = {
  [CHAIN_IDS.ETH_MAINNET]: {
    providerRPCs: {
      ALCHEMY: "https://eth-mainnet.g.alchemy.com/v2/",
      INFURA: "https://mainnet.infura.io/v3/"
    }
  },
  [CHAIN_IDS.ETH_GOERLI] : {
    providerRPCs: {
      ALCHEMY: "https://eth-goerli.g.alchemy.com/v2/",
      INFURA: "https://goerli.infura.io/v3/"
    }
  },
  [CHAIN_IDS.OPT_MAINNET] : {
    providerRPCs: {
      ALCHEMY: "https://opt-mainnet.g.alchemy.com/v2/",
      INFURA: "https://optimism-mainnet.infura.io/v3/"
    }
  },
  [CHAIN_IDS.OPT_GOERLI] : {
    providerRPCs: {
      ALCHEMY: "https://opt-goerli.g.alchemy.com/v2/",
      INFURA: "https://optimism-goerli.infura.io/v3/"
    }
  },
  [CHAIN_IDS.MATIC_MAINNET] : {
    providerRPCs: {
      ALCHEMY: "https://polygon-mainnet.g.alchemy.com/v2/",
      INFURA: "https://polygon-mainnet.infura.io/v3/"
    }
  },
  [CHAIN_IDS.MATIC_MUMBAI] : {
    providerRPCs: {
      ALCHEMY: "https://polygon-mumbai.g.alchemy.com/v2/",
      INFURA: "https://polygon-mumbai.infura.io/v3/"
    }
  },
  [CHAIN_IDS.ARB_MAINNET] : {
    providerRPCs: {
      ALCHEMY: "https://arb-mainnet.g.alchemy.com/v2/",
      INFURA: "https://arbitrum-mainnet.infura.io/v3/"
    }
  },
  [CHAIN_IDS.ARB_GOERLI] : {
    providerRPCs: {
      ALCHEMY: "https://arb-goerli.g.alchemy.com/v2/",
      INFURA: "https://arbitrum-goerli.infura.io/v3"
    }
  },
}

export const GELATO_SUPPORTED_NETWORKS = [CHAIN_IDS.MATIC_MAINNET, CHAIN_IDS.MATIC_MUMBAI];

export const GELATO_RELAY_ADDRESS = "0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0d";