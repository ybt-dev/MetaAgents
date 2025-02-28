import { Plugin } from '@elizaos/core';
import { InitiaApi } from '../../api/initia.api.ts';
import InitiaWalletProvider from './providers/wallet.provider.ts';
import InitiaTransferAction from './actions/transfer.action.ts';

export default class InitiaPlugin implements Plugin {
  public name = 'initia';
  public description = 'Initia Plugin for Eliza';

  public actions: Plugin['actions'] = [];
  public providers: Plugin['providers'] = [];

  constructor(private initiaApi: InitiaApi) {
    this.providers = [new InitiaWalletProvider(initiaApi)];
    this.actions = [new InitiaTransferAction(initiaApi)];
  }
}
