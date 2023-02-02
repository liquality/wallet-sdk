"use strict";
exports.__esModule = true;
exports.createChainProvider = exports.getChainProvider = void 0;
var tslib_1 = require("tslib");
var ethers_1 = require("ethers");
var config_1 = require("../common/config");
var chainProviderOptions = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, (config_1.Config.ALCHEMY_API_KEY && { alchemy: config_1.Config.ALCHEMY_API_KEY })), (config_1.Config.ETHERSCAN_API_KEY && { etherscan: config_1.Config.ETHERSCAN_API_KEY })), (config_1.Config.INFURA_PROJECT_ID && { infura: config_1.Config.INFURA_PROJECT_ID })), (config_1.Config.POCKET_NETWORK_APPLICATION_ID && {
    pocket: config_1.Config.POCKET_NETWORK_APPLICATION_ID
})), (config_1.Config.QUORUM && {
    quorum: config_1.Config.QUORUM
}));
var chainProviderCache = {};
function getChainProvider(chainId) {
    if (chainProviderCache[chainId])
        return chainProviderCache[chainId];
    return createChainProvider(chainId);
}
exports.getChainProvider = getChainProvider;
;
function createChainProvider(chainId) {
    var chainProvider = ethers_1.ethers.getDefaultProvider(chainId, chainProviderOptions);
    chainProviderCache[chainId] = chainProvider;
    return chainProvider;
}
exports.createChainProvider = createChainProvider;
