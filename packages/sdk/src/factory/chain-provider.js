"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChainProvider = exports.getChainProvider = void 0;
const ethers_1 = require("ethers");
const config_1 = require("../common/config");
const chainProviderOptions = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (config_1.Config.ALCHEMY_API_KEY && { alchemy: config_1.Config.ALCHEMY_API_KEY })), (config_1.Config.ETHERSCAN_API_KEY && { etherscan: config_1.Config.ETHERSCAN_API_KEY })), (config_1.Config.INFURA_PROJECT_ID && { infura: config_1.Config.INFURA_PROJECT_ID })), (config_1.Config.POCKET_NETWORK_APPLICATION_ID && {
    pocket: config_1.Config.POCKET_NETWORK_APPLICATION_ID,
})), (config_1.Config.QUORUM && {
    quorum: config_1.Config.QUORUM,
}));
const chainProviderCache = {};
function getChainProvider(chainId) {
    if (chainProviderCache[chainId])
        return chainProviderCache[chainId];
    return createChainProvider(chainId);
}
exports.getChainProvider = getChainProvider;
;
function createChainProvider(chainId) {
    const chainProvider = ethers_1.ethers.getDefaultProvider(chainId, chainProviderOptions);
    chainProviderCache[chainId] = chainProvider;
    return chainProvider;
}
exports.createChainProvider = createChainProvider;
