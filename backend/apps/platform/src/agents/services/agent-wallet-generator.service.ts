import { Injectable } from '@nestjs/common';
import { MnemonicKey } from '@initia/initia.js';

export interface GeneratedWallet {
  address: string;
  mnemonic: string;
  privateKey: string;
}

export interface AgentWalletGeneratorService {
  generateWallet(): Promise<GeneratedWallet>;
}

@Injectable()
export class InitiaAgentWalletGeneratorService implements AgentWalletGeneratorService {
  public async generateWallet() {
    const mnemonicKey = new MnemonicKey();

    return {
      mnemonic: mnemonicKey.mnemonic,
      privateKey: mnemonicKey.privateKey.toString('hex'),
      address: mnemonicKey.accAddress,
    };
  }
}
