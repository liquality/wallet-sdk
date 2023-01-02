import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get(':address')
  async login(@Param('address') address: string) {
    console.log('Got into AUTH controller, endpoint calls class');
    return await this.authService.login(address);
  }
}
