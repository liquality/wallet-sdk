"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const config_1 = require("../common/config");
const chain_provider_1 = require("../factory/chain-provider");
const gas_price_multipliers_1 = __importDefault(require("./constants/gas-price-multipliers"));
const transaction_speed_1 = __importDefault(require("./types/transaction-speed"));
class TransactionService {
    static async prepareTransaction(txRequest, chainID, speed = transaction_speed_1.default.Average) {
        const chainProvider = (0, chain_provider_1.getChainProvider)(chainID);
        const fees = await this.getFees(speed, chainProvider);
        return Object.assign(Object.assign(Object.assign(Object.assign({}, txRequest), fees), { gasLimit: await this.estimateGas(txRequest, chainProvider), nonce: await chainProvider.getTransactionCount(txRequest.from) }), (!!fees.maxFeePerGas && { type: 2 }));
    }
    static async getFees(speed, chainProvider) {
        const fees = await chainProvider.getFeeData();
        const extractedFees = {};
        if (fees.maxFeePerGas) {
            extractedFees.maxFeePerGas = this.calculateFee(fees.maxFeePerGas, gas_price_multipliers_1.default[speed]);
            extractedFees.maxPriorityFeePerGas = this.calculateFee(fees.maxPriorityFeePerGas, gas_price_multipliers_1.default[speed]);
        }
        else {
            extractedFees.gasPrice = this.calculateFee(fees.gasPrice, gas_price_multipliers_1.default[speed]);
        }
        return extractedFees;
    }
    static async estimateGas(txRequest, chainProvider) {
        const estimation = await chainProvider.estimateGas(txRequest);
        // do not add gas limit margin for sending native asset
        if (estimation.eq(21000)) {
            return estimation;
        }
        // gas estimation is increased with 50%
        else {
            return this.calculateGasMargin(estimation);
        }
    }
    static toEthersBigNumber(a) {
        if (typeof a === 'string')
            return ethers_1.BigNumber.from(a);
        return ethers_1.BigNumber.from(a.toFixed(0));
    }
    static calculateGasMargin(value) {
        const offset = new bignumber_js_1.default(value.toString())
            .multipliedBy(config_1.Config.GAS_LIMIT_MARGIN)
            .div('10000');
        const estimate = this.toEthersBigNumber(offset.plus(value.toString()).toFixed(0));
        return estimate;
    }
    static calculateFee(base, multiplier) {
        return this.toEthersBigNumber(new bignumber_js_1.default(base.toString()).times(multiplier));
    }
}
exports.TransactionService = TransactionService;
