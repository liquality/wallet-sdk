import { Config } from "../../common/config";
import TransactionSpeed from "../types/transaction-speed";

export function gasMultiplier(speed: TransactionSpeed) {
  switch(speed) {
    case TransactionSpeed.Slow: return Config.SLOW_GAS_PRICE_MULTIPLIER
    case TransactionSpeed.Average: return Config.AVERAGE_GAS_PRICE_MULTIPLIER
    case TransactionSpeed.Fast: return Config.FAST_GAS_PRICE_MULTIPLIER
  }
}
export default gasMultiplier;
