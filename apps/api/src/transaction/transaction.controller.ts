import { TransactionResponse } from '@ethersproject/providers';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ChainId } from '../common/chain-id.dto';
import { SignedTransaction } from './dto/signed-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('on-chain-transactions')
  async sendTransaction(
    @Body() payload: SignedTransaction,
    @Query() query: ChainId,
  ): Promise<TransactionResponse> {
    ~query;
    return await this.transactionService.sendTransaction(payload.tx);
  }
}
