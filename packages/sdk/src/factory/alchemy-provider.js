"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlchemyProvider = exports.getAlchemyProvider = void 0;
const alchemy_sdk_1 = require("alchemy-sdk");
const chain_ids_1 = require("../common/chain-ids");
const config_1 = require("../common/config");
const chainIdToNetwork = {
    [chain_ids_1.CHAIN_IDS.ETH_MAINNET]: alchemy_sdk_1.Network.ETH_MAINNET,
    [chain_ids_1.CHAIN_IDS.ETH_GOERLI]: alchemy_sdk_1.Network.ETH_GOERLI,
    [chain_ids_1.CHAIN_IDS.OPT_MAINNET]: alchemy_sdk_1.Network.OPT_MAINNET,
    [chain_ids_1.CHAIN_IDS.OPT_GOERLI]: alchemy_sdk_1.Network.OPT_GOERLI,
    [chain_ids_1.CHAIN_IDS.ARB_MAINNET]: alchemy_sdk_1.Network.ARB_MAINNET,
    [chain_ids_1.CHAIN_IDS.ARB_GOERLI]: alchemy_sdk_1.Network.ARB_GOERLI,
    [chain_ids_1.CHAIN_IDS.MATIC_MAINNET]: alchemy_sdk_1.Network.MATIC_MAINNET,
    [chain_ids_1.CHAIN_IDS.MATIC_MUMBAI]: alchemy_sdk_1.Network.MATIC_MUMBAI,
    [chain_ids_1.CHAIN_IDS.ASTAR_MAINNET]: alchemy_sdk_1.Network.ASTAR_MAINNET,
};
const alchemyProviderCache = {};
function getAlchemyProvider(chainId) {
    if (alchemyProviderCache[chainId])
        return alchemyProviderCache[chainId];
    return createAlchemyProvider(chainId);
}
exports.getAlchemyProvider = getAlchemyProvider;
;
function createAlchemyProvider(chainId) {
    const settings = {
        apiKey: config_1.Config.ALCHEMY_API_KEY,
        network: chainIdToNetwork[chainId],
    };
    const alchemyProvider = new alchemy_sdk_1.Alchemy(settings);
    alchemyProviderCache[chainId] = alchemyProvider;
    return alchemyProvider;
}
exports.createAlchemyProvider = createAlchemyProvider;
