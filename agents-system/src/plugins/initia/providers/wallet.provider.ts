import { elizaLogger } from '@elizaos/core';
import type { IAgentRuntime, Provider } from '@elizaos/core';
import AgentSettingsKey from '../../../enums/agent-settings-key.enum.ts';
import { InitiaApi } from '../../../api/initia.api.ts';

export default class InitiaWalletProvider implements Provider {
  constructor(private initiaApi: InitiaApi) {}

  public async get(runtime: IAgentRuntime) {
    try {
      const walletAddress = runtime.getSetting(AgentSettingsKey.InitiaWalletAddress);

      if (!walletAddress) {
        return null;
      }

      const { amount, denom } = await this.initiaApi.getWalletBalance(walletAddress);

      return `Initia Wallet Address: ${walletAddress}\nBalance: ${amount} ${denom}`;
    } catch (error) {
      elizaLogger.error('Error getting initia wallet balance: ', error);

      return null;
    }
  }
}
