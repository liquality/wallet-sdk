import TransactionSpeed from '../types/transaction-speed';
import * as dotenv from 'dotenv';
dotenv.config();

const GasPriceMultipliers: Record<TransactionSpeed, number> = {
  [TransactionSpeed.Slow]: Number(
    process.env.SLOW_GAS_PRICE_MULTIPLIER,
  ).valueOf(),
  [TransactionSpeed.Average]: Number(
    process.env.AVERAGE_GAS_PRICE_MULTIPLIER,
  ).valueOf(),
  [TransactionSpeed.Fast]: Number(
    process.env.FAST_GAS_PRICE_MULTIPLIER,
  ).valueOf(),
};

export default GasPriceMultipliers;
