"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../common/config");
const transaction_speed_1 = __importDefault(require("../types/transaction-speed"));
const GasPriceMultipliers = {
    [transaction_speed_1.default.Slow]: config_1.Config.SLOW_GAS_PRICE_MULTIPLIER,
    [transaction_speed_1.default.Average]: config_1.Config.AVERAGE_GAS_PRICE_MULTIPLIER,
    [transaction_speed_1.default.Fast]: config_1.Config.FAST_GAS_PRICE_MULTIPLIER,
};
exports.default = GasPriceMultipliers;
