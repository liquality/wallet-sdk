"use strict";
var _a;
exports.__esModule = true;
exports.createAlchemyProvider = exports.getAlchemyProvider = void 0;
var alchemy_sdk_1 = require("alchemy-sdk");
var chain_ids_1 = require("../common/chain-ids");
var config_1 = require("../common/config");
var chainIdToNetwork = (_a = {},
    _a[chain_ids_1.CHAIN_IDS.ETH_MAINNET] = alchemy_sdk_1.Network.ETH_MAINNET,
    _a[chain_ids_1.CHAIN_IDS.ETH_GOERLI] = alchemy_sdk_1.Network.ETH_GOERLI,
    _a[chain_ids_1.CHAIN_IDS.OPT_MAINNET] = alchemy_sdk_1.Network.OPT_MAINNET,
    _a[chain_ids_1.CHAIN_IDS.OPT_GOERLI] = alchemy_sdk_1.Network.OPT_GOERLI,
    _a[chain_ids_1.CHAIN_IDS.ARB_MAINNET] = alchemy_sdk_1.Network.ARB_MAINNET,
    _a[chain_ids_1.CHAIN_IDS.ARB_GOERLI] = alchemy_sdk_1.Network.ARB_GOERLI,
    _a[chain_ids_1.CHAIN_IDS.MATIC_MAINNET] = alchemy_sdk_1.Network.MATIC_MAINNET,
    _a[chain_ids_1.CHAIN_IDS.MATIC_MUMBAI] = alchemy_sdk_1.Network.MATIC_MUMBAI,
    _a[chain_ids_1.CHAIN_IDS.ASTAR_MAINNET] = alchemy_sdk_1.Network.ASTAR_MAINNET,
    _a);
var alchemyProviderCache = {};
function getAlchemyProvider(chainId) {
    if (alchemyProviderCache[chainId])
        return alchemyProviderCache[chainId];
    return createAlchemyProvider(chainId);
}
exports.getAlchemyProvider = getAlchemyProvider;
;
function createAlchemyProvider(chainId) {
    var settings = {
        apiKey: config_1.Config.ALCHEMY_API_KEY,
        network: chainIdToNetwork[chainId]
    };
    var alchemyProvider = new alchemy_sdk_1.Alchemy(settings);
    alchemyProviderCache[chainId] = alchemyProvider;
    return alchemyProvider;
}
exports.createAlchemyProvider = createAlchemyProvider;
