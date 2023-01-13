import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [CommonModule],
  exports: [TransactionService],
})
export class TransactionModule {}
