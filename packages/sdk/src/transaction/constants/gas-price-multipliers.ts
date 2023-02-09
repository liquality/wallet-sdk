import { Config } from "../../common/config";
import TransactionSpeed from "../types/transaction-speed";

const GasPriceMultipliers: Record<TransactionSpeed, number> = {
  [TransactionSpeed.Slow]: Config.SLOW_GAS_PRICE_MULTIPLIER,
  [TransactionSpeed.Average]: Config.AVERAGE_GAS_PRICE_MULTIPLIER,
  [TransactionSpeed.Fast]: Config.FAST_GAS_PRICE_MULTIPLIER,
};

export default GasPriceMultipliers;
