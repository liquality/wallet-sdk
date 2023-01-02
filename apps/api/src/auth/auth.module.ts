import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [CommonModule],
})
export class AuthModule { }
