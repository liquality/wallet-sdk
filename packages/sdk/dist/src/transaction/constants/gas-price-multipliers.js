"use strict";
var _a;
exports.__esModule = true;
var tslib_1 = require("tslib");
var config_1 = require("../../common/config");
var transaction_speed_1 = tslib_1.__importDefault(require("../types/transaction-speed"));
var GasPriceMultipliers = (_a = {},
    _a[transaction_speed_1["default"].Slow] = config_1.Config.SLOW_GAS_PRICE_MULTIPLIER,
    _a[transaction_speed_1["default"].Average] = config_1.Config.AVERAGE_GAS_PRICE_MULTIPLIER,
    _a[transaction_speed_1["default"].Fast] = config_1.Config.FAST_GAS_PRICE_MULTIPLIER,
    _a);
exports["default"] = GasPriceMultipliers;
