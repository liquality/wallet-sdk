import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Login to wallet
  public async createWallet(loginDetails: string) {
    console.log('GOT IN LOGIN!', loginDetails);
    return { hej: 'You logged in!' };
  }
}
