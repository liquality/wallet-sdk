"use strict";
exports.__esModule = true;
exports.sdk = void 0;
var config_1 = require("./common/config");
var nft_service_1 = require("./nft/nft.service");
var auth_service_1 = require("./auth/auth.service");
//export * from "./auth";
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
