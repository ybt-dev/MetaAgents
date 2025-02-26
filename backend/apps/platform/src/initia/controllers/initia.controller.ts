import { Controller, Get, Post, Body } from '@nestjs/common';
import * as initia from '@initia/initia.js';
import type { Wallet, LCDClient, Tx } from '@initia/initia.js';

interface WalletProviderOptions {
  chainId: string;
  nodeUrl: string;
  privateKey?: string;
  mnemonic?: string;
}

const DEFAULT_INITIA_TESTNET_CONFIGS: WalletProviderOptions = {
  chainId: 'initiation-2',
  nodeUrl: 'https://lcd.initiation-2.initia.xyz/',
};

@Controller('initia')
export class InitiaController {
  private wallet: Wallet | null = null;
  private restClient: LCDClient | null = null;

  constructor() {}

  @Get('/initialize')
  public async initialize(privateKey: string, mnemonic: string): Promise<void> {
    if (!privateKey && !mnemonic) {
      throw new Error('Either INITIA_PRIVATE_KEY or INITIA_MNEMONIC must be configured');
    }

    const { Wallet, LCDClient, RawKey, MnemonicKey } = initia;

    this.restClient = new LCDClient(DEFAULT_INITIA_TESTNET_CONFIGS.nodeUrl, {
      chainId: DEFAULT_INITIA_TESTNET_CONFIGS.chainId,
      gasPrices: '0.15uinit',
      gasAdjustment: '1.75',
    });

    if (privateKey) {
      this.wallet = new Wallet(this.restClient, RawKey.fromHex(privateKey));
    } else if (mnemonic) {
      this.wallet = new Wallet(this.restClient, new MnemonicKey({ mnemonic }));
    }
  }

  @Get('/wallet')
  getWallet() {
    if (this.wallet == null) {
      throw new Error('Initia wallet is not configured.');
    }
    return this.wallet;
  }

  @Get('/address')
  getAddress() {
    if (this.wallet == null) {
      throw new Error('Initia wallet is not configured.');
    }
    return this.wallet.key.accAddress;
  }

  @Get('/balance')
  async getBalance() {
    if (this.wallet == null) {
      throw new Error('Initia wallet is not configured.');
    }
    return this.wallet.rest.bank.balance(this.getAddress());
  }

  @Post('/send')
  async sendTransaction(@Body() signedTx: Tx | string) {
    return await this.restClient.tx.broadcast(signedTx);
  }
}
