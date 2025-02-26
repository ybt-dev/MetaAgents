import type { IAgentRuntime, Provider, Memory, State } from "@elizaos/core";

const BACKEND_URL = 'http://localhost:3000/initia';

export class WalletProvider {
  private wallet: any | null = null;
  private restClient: any | null = null;
  private runtime: IAgentRuntime;

  constructor(runtime: IAgentRuntime) {
    this.runtime = runtime;
  }

  public async initialize(runtime?: IAgentRuntime): Promise<void> {
    if (runtime) {
      this.runtime = runtime;
    }
  }

  getWallet() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet;
  }

  async getAddress() {
    const privateKey = this.runtime.getSetting("INITIA_PRIVATE_KEY");
    const mnemonic = this.runtime.getSetting("INITIA_MNEMONIC");

    const res = await fetch(`${BACKEND_URL}/address`, {
      method: 'Post',
      body: JSON.stringify({
        mnemonic: mnemonic,
        privateKey: privateKey
      })
    });
    return res;
  }

  async getBalance() {
    const privateKey = this.runtime.getSetting("INITIA_PRIVATE_KEY");
    const mnemonic = this.runtime.getSetting("INITIA_MNEMONIC");

    const res = await fetch(`${BACKEND_URL}/address`, {
      method: 'Post',
      body: JSON.stringify({
        mnemonic: mnemonic,
        privateKey: privateKey
      })
    });

    return res;
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
