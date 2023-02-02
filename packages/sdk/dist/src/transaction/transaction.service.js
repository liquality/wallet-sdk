"use strict";
exports.__esModule = true;
exports.TransactionService = void 0;
var tslib_1 = require("tslib");
var bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
var ethers_1 = require("ethers");
var config_1 = require("../common/config");
var chain_provider_1 = require("../factory/chain-provider");
var gas_price_multipliers_1 = tslib_1.__importDefault(require("./constants/gas-price-multipliers"));
var transaction_speed_1 = tslib_1.__importDefault(require("./types/transaction-speed"));
var TransactionService = /** @class */ (function () {
    function TransactionService() {
    }
    TransactionService.prepareTransaction = function (txRequest, chainID, speed) {
        if (speed === void 0) { speed = transaction_speed_1["default"].Average; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var chainProvider, fees, _a;
            var _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        chainProvider = (0, chain_provider_1.getChainProvider)(chainID);
                        return [4 /*yield*/, this.getFees(speed, chainProvider)];
                    case 1:
                        fees = _c.sent();
                        _a = [tslib_1.__assign(tslib_1.__assign({}, txRequest), fees)];
                        _b = {};
                        return [4 /*yield*/, this.estimateGas(txRequest, chainProvider)];
                    case 2:
                        _b.gasLimit = _c.sent();
                        return [4 /*yield*/, chainProvider.getTransactionCount(txRequest.from)];
                    case 3: return [2 /*return*/, tslib_1.__assign.apply(void 0, [tslib_1.__assign.apply(void 0, _a.concat([(_b.nonce = _c.sent(), _b)])), (!!fees.maxFeePerGas && { type: 2 })])];
                }
            });
        });
    };
    TransactionService.getFees = function (speed, chainProvider) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fees, extractedFees;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chainProvider.getFeeData()];
                    case 1:
                        fees = _a.sent();
                        extractedFees = {};
                        if (fees.maxFeePerGas) {
                            extractedFees.maxFeePerGas = this.calculateFee(fees.maxFeePerGas, gas_price_multipliers_1["default"][speed]);
                            extractedFees.maxPriorityFeePerGas = this.calculateFee(fees.maxPriorityFeePerGas, gas_price_multipliers_1["default"][speed]);
                        }
                        else {
                            extractedFees.gasPrice = this.calculateFee(fees.gasPrice, gas_price_multipliers_1["default"][speed]);
                        }
                        return [2 /*return*/, extractedFees];
                }
            });
        });
    };
    TransactionService.estimateGas = function (txRequest, chainProvider) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var estimation;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chainProvider.estimateGas(txRequest)];
                    case 1:
                        estimation = _a.sent();
                        // do not add gas limit margin for sending native asset
                        if (estimation.eq(21000)) {
                            return [2 /*return*/, estimation];
                        }
                        // gas estimation is increased with 50%
                        else {
                            return [2 /*return*/, this.calculateGasMargin(estimation)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TransactionService.toEthersBigNumber = function (a) {
        if (typeof a === 'string')
            return ethers_1.BigNumber.from(a);
        return ethers_1.BigNumber.from(a.toFixed(0));
    };
    TransactionService.calculateGasMargin = function (value) {
        var offset = new bignumber_js_1["default"](value.toString())
            .multipliedBy(config_1.Config.GAS_LIMIT_MARGIN)
            .div('10000');
        var estimate = this.toEthersBigNumber(offset.plus(value.toString()).toFixed(0));
        return estimate;
    };
    TransactionService.calculateFee = function (base, multiplier) {
        return this.toEthersBigNumber(new bignumber_js_1["default"](base.toString()).times(multiplier));
    };
    return TransactionService;
}());
exports.TransactionService = TransactionService;
