import { Injectable } from '@nestjs/common';
import * as initia from '@initia/initia.js';

const { LCDClient, Wallet, RawKey, MsgSend } = initia;

export interface CreateSessionParams {
  message: string;
  signature: string;
}

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

export interface InitiaService {
  getAddress(mnemonic: string, privateKey?: string): string;
  getBalance(address: string, mnemonic: string, privateKey?: string);
  sendTx(sender: string, recipient: string, amount: string, mnemonic: string, privateKey?: string);
}

@Injectable()
export class DefaultInitiaService implements InitiaService {
  constructor() {}

  private getClient(): InstanceType<typeof LCDClient> {
    return new LCDClient(DEFAULT_INITIA_TESTNET_CONFIGS.nodeUrl, {
      chainId: DEFAULT_INITIA_TESTNET_CONFIGS.chainId,
      gasPrices: '0.15uinit',
      gasAdjustment: '1.75',
    });
  }

  private getWallet(
    restClient: InstanceType<typeof LCDClient>,
    mnemonic: string,
    privateKey?: string,
  ): InstanceType<typeof Wallet> {
    if (privateKey) {
      return new Wallet(restClient, RawKey.fromHex(privateKey));
    } else {
      return new Wallet(restClient, new initia.MnemonicKey({ mnemonic }));
    }
  }
  public getAddress(mnemonic: string, privateKey?: string): string {
    const restClient = this.getClient();
    const wallet = this.getWallet(restClient, mnemonic, privateKey);
    return wallet.key.accAddress;
  }

  public async getBalance(address: string, mnemonic: string, privateKey?: string) {
    const restClient = this.getClient();
    const wallet = this.getWallet(restClient, mnemonic, privateKey);

    return await wallet.rest.bank.balance(address);
  }

  public async sendTx(sender: string, recipient: string, amount: string, mnemonic: string, privateKey?: string) {
    const restClient = this.getClient();
    const wallet = this.getWallet(restClient, mnemonic, privateKey);

    const msgSend = new MsgSend(sender, recipient, amount);
    const signedTx = await wallet.createAndSignTx({
      msgs: [msgSend],
      memo: '',
    });

    const txResult = await restClient.tx.broadcast(signedTx);

    return txResult;
  }
}
