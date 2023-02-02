"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.sdk = exports.NftService = exports.AuthService = void 0;
var config_1 = require("./common/config");
var nft_service_1 = require("./nft/nft.service");
var auth_service_1 = require("./auth/auth.service");
var auth_service_2 = require("./auth/auth.service");
__createBinding(exports, auth_service_2, "AuthService");
var nft_service_2 = require("./nft/nft.service");
__createBinding(exports, nft_service_2, "NftService");
function setup(config) {
    config_1.Config.ALCHEMY_API_KEY = config.alchemyApiKey;
    config_1.Config.ETHERSCAN_API_KEY = config.etherscanApiKey;
    config_1.Config.INFURA_PROJECT_ID = config.infuraProjectId;
    config_1.Config.POCKET_NETWORK_APPLICATION_ID = config.pocketNetworkApplicationID;
    config_1.Config.QUORUM = config.quorum;
    config_1.Config.SLOW_GAS_PRICE_MULTIPLIER = config.slowGasPriceMultiplier;
    config_1.Config.AVERAGE_GAS_PRICE_MULTIPLIER = config.averageGasPriceMultiplier;
    config_1.Config.FAST_GAS_PRICE_MULTIPLIER = config.fastGasPriceMultiplier;
    config_1.Config.GAS_LIMIT_MARGIN = config.gasLimitMargin;
}
exports.sdk = { nft: nft_service_1.NftService, auth: auth_service_1.AuthService, setup: setup };
