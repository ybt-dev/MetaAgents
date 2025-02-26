import { Controller, Inject, Post } from '@nestjs/common';
import { InitiaService } from '@apps/platform/initia/services';
import InitiaModuleTokens from '../initia.module.tokens';

@Controller('initia')
export class InitiaController {
  constructor(@Inject(InitiaModuleTokens.Services.InitiaService) private readonly initiaService: InitiaService) {}

  @Post('address')
  getAddress(mnemonic: string, privateKey?: string): string {
    return this.initiaService.getAddress(mnemonic, privateKey);
  }

  @Post('balance')
  getBalance(address: string, mnemonic: string, privateKey?: string) {
    return this.initiaService.getBalance(address, mnemonic, privateKey);
  }

  @Post('send')
  sendTx(sender: string, recipient: string, amount: string, mnemonic: string, privateKey?: string) {
    return this.initiaService.sendTx(sender, recipient, amount, mnemonic, privateKey);
  }
}
