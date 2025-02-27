import { Injectable } from '@nestjs/common';
import * as initia from '@initia/initia.js';

const { LCDClient, Wallet, RawKey, MsgSend, MsgExecute, bcs } = initia;

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
  getNftInfo(nftId: string, moduleOwner: string);
  mintNft(
    mnemonic: string,
    destinationAddress: string,
    collectionName: string,
    name: string,
    description: string,
    imageUrl: string,
    walletAddress: string,
  );
  createCollection(
    mnemonic: string,
    destinationAddress: string,
    name: string,
    description: string,
    uri: string,
    maxSupply: number,
    royalty: number,
  );
}

@Injectable()
export class DefaultInitiaService implements InitiaService {
  constructor() {}

  private getClient(): InstanceType<typeof LCDClient> {
    return new LCDClient(DEFAULT_INITIA_TESTNET_CONFIGS.nodeUrl, {
      chainId: DEFAULT_INITIA_TESTNET_CONFIGS.chainId,
      gasPrices: '0.15uinit',
      gasAdjustment: '2.0',
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

  public async getNftInfo(nftId: string, moduleOwner: string) {
    const restClient = this.getClient();
    const nftInfo = await restClient.move.viewJSON(moduleOwner, 'metaAgents_nft_module', 'get_nft_info', [], [nftId]);
    return nftInfo;
  }

  public async mintNft(
    mnemonic: string,
    destinationAddress: string,
    collectionName: string,
    name: string,
    description: string,
    imageUrl: string,
    walletAddress: string,
  ) {
    const restClient = this.getClient();
    const wallet = this.getWallet(restClient, mnemonic);

    const msg = new MsgExecute(
      wallet.key.accAddress,
      destinationAddress,
      'metaAgents_nft_module',
      'mint_nft',
      undefined,
      [
        bcs.string().serialize(collectionName).toBase64(),
        bcs.string().serialize(name).toBase64(),
        bcs.string().serialize(description).toBase64(),
        bcs.string().serialize(imageUrl).toBase64(),
        bcs.address().serialize(walletAddress).toBase64(),
      ],
    );

    const signedTx = await wallet.createAndSignTx({
      msgs: [msg],
    });

    const result = restClient.tx.broadcast(signedTx);

    return result;
  }

  public async createCollection(
    mnemonic: string,
    destinationAddress: string,
    name: string,
    description: string,
    uri: string,
    maxSupply: number,
    royalty: number,
  ) {
    const restClient = this.getClient();
    const wallet = this.getWallet(restClient, mnemonic);

    const msg = new MsgExecute(
      wallet.key.accAddress,
      destinationAddress,
      'metaAgents_nft_module',
      'create_collection',
      undefined,
      [
        bcs.string().serialize(name).toBase64(),
        bcs.string().serialize(description).toBase64(),
        bcs.string().serialize(uri).toBase64(),
        bcs.u64().serialize(maxSupply).toBase64(),
        bcs.u64().serialize(royalty).toBase64(),
      ],
    );

    const signedTx = await wallet.createAndSignTx({
      msgs: [msg],
    });

    const result = restClient.tx.broadcast(signedTx);

    return result;
  }
}
