import { FeeData, Provider } from '@ethersproject/providers';
import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber, PopulatedTransaction } from 'ethers';
import GasPriceMultipliers from './constants/gas-price-multipliers';
import TransactionSpeed from './types/transaction-speed';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('CHAIN_PROVIDER') private readonly chainProvider: Provider,
  ) {}

  public async prepareTransaction(
    txRequest: PopulatedTransaction,
    speed = TransactionSpeed.Average,
  ): Promise<PopulatedTransaction> {
    const fees = await this.getFees(speed);
    return {
      ...txRequest,
      ...fees,
      gasLimit: await this.estimateGas(txRequest),
      nonce: await this.chainProvider.getTransactionCount(txRequest.from),
      ...(!!fees.maxFeePerGas && { type: 2 }),
    };
  }

  public async sendTransaction(transaction: string) {
    return this.chainProvider.sendTransaction(transaction);
  }

  private async getFees(speed: TransactionSpeed): Promise<Partial<FeeData>> {
    const fees = await this.chainProvider.getFeeData();

    const extractedFees: Partial<FeeData> = {};
    if (fees.maxFeePerGas) {
      extractedFees.maxFeePerGas = this.calculateFee(
        fees.maxFeePerGas,
        GasPriceMultipliers[speed],
      );
      extractedFees.maxPriorityFeePerGas = this.calculateFee(
        fees.maxPriorityFeePerGas,
        GasPriceMultipliers[speed],
      );
    } else {
      extractedFees.gasPrice = this.calculateFee(
        fees.gasPrice,
        GasPriceMultipliers[speed],
      );
    }

    return extractedFees;
  }

  private async estimateGas(txRequest: PopulatedTransaction) {
    const estimation = await this.chainProvider.estimateGas(txRequest);
    // do not add gas limit margin for sending native asset
    if (estimation.eq(21000)) {
      return estimation;
    }
    // gas estimation is increased with 50%
    else {
      return this.calculateGasMargin(estimation);
    }
  }

  private toEthersBigNumber(a: BigNumber | string): EthersBigNumber {
    if (typeof a === 'string') return EthersBigNumber.from(a);
    return EthersBigNumber.from(a.toFixed(0));
  }

  private calculateGasMargin(value: EthersBigNumber): EthersBigNumber {
    const offset = new BigNumber(value.toString())
      .multipliedBy(process.env.GAS_LIMIT_MARGIN)
      .div('10000');
    const estimate = this.toEthersBigNumber(
      offset.plus(value.toString()).toFixed(0),
    );
    return estimate;
  }

  private calculateFee(
    base: EthersBigNumber,
    multiplier: number,
  ): EthersBigNumber {
    return this.toEthersBigNumber(
      new BigNumber(base.toString()).times(multiplier),
    );
  }
}
