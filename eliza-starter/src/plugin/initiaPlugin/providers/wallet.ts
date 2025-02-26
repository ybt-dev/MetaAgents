import type { IAgentRuntime, Provider, Memory, State } from "@elizaos/core";

import * as initia from "@initia/initia.js";

// Add type imports for Initia.js
import type { Wallet, LCDClient, Tx } from "@initia/initia.js";

interface WalletProviderOptions {
  chainId: string;
  nodeUrl: string;
  privateKey?: string;
  mnemonic?: string;
}

const DEFAULT_INITIA_TESTNET_CONFIGS: WalletProviderOptions = {
  chainId: "initiation-2",
  nodeUrl: "https://lcd.initiation-2.initia.xyz/",
};

export class WalletProvider {
  private wallet: Wallet | null = null;
  private restClient: LCDClient | null = null;
  private runtime: IAgentRuntime;

  constructor(runtime: IAgentRuntime) {
    this.runtime = runtime;
  }

  public async initialize(runtime?: IAgentRuntime): Promise<void> {
    if (runtime) {
      this.runtime = runtime;
    }

    const privateKey = this.runtime.getSetting("INITIA_PRIVATE_KEY");
    const mnemonic = this.runtime.getSetting("INITIA_MNEMONIC");

    if (!privateKey && !mnemonic) {
      throw new Error(
        "Either INITIA_PRIVATE_KEY or INITIA_MNEMONIC must be configured"
      );
    }

    const { Wallet, LCDClient, RawKey, MnemonicKey } = initia;

    this.restClient = new LCDClient(DEFAULT_INITIA_TESTNET_CONFIGS.nodeUrl, {
      chainId: DEFAULT_INITIA_TESTNET_CONFIGS.chainId,
      gasPrices: "0.15uinit",
      gasAdjustment: "1.75",
    });

    if (privateKey) {
      this.wallet = new Wallet(this.restClient, RawKey.fromHex(privateKey));
    } else if (mnemonic) {
      this.wallet = new Wallet(this.restClient, new MnemonicKey({ mnemonic }));
    }
  }

  getWallet() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet;
  }

  getAddress() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet.key.accAddress;
  }

  async getBalance() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet.rest.bank.balance(this.getAddress());
  }

  async sendTransaction(signedTx: Tx | string) {
    return await this.restClient.tx.broadcast(signedTx);
  }
}

export const initiaWalletProvider: Provider = {
  async get(
    runtime: IAgentRuntime,
    _message: Memory,
    _state?: State
  ): Promise<string | null> {
    if (!runtime.getSetting("INITIA_PRIVATE_KEY")) {
      return null;
    }

    try {
      const nodeUrl: string | null = runtime.getSetting("INITIA_NODE_URL");
      const chainId: string | null = runtime.getSetting("INITIA_CHAIN_ID");
      let walletProvider: WalletProvider;
      if (nodeUrl === null || chainId === null) {
        walletProvider = new WalletProvider(runtime);
      } else {
        walletProvider = new WalletProvider(runtime);
      }

      await walletProvider.initialize();

      const address = walletProvider.getAddress();
      const balance = await walletProvider.getBalance();
      return `Initia Wallet Address: ${address}\nBalance: ${balance} INIT`;
    } catch (e) {
      console.error("Error during configuring initia wallet provider", e);
      return null;
    }
  },
};
