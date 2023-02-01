import { PopulatedTransaction } from 'ethers';
import TransactionSpeed from './types/transaction-speed';
export declare abstract class TransactionService {
    static prepareTransaction(txRequest: PopulatedTransaction, chainID: number, speed?: TransactionSpeed): Promise<PopulatedTransaction>;
    private static getFees;
    private static estimateGas;
    private static toEthersBigNumber;
    private static calculateGasMargin;
    private static calculateFee;
}
//# sourceMappingURL=transaction.service.d.ts.map