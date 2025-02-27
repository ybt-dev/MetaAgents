import type { Plugin } from '@elizaos/core';
import { InitiaApi } from '../../api/initia.api.ts';
import GenerateNftCollectionAction from './actions/generate-nft-collection.action.ts';

export default class NftPlugin implements Plugin {
  public name = 'nft';
  public description = 'NFT plugin';
  public actions: Plugin['actions'] = [];

  constructor(private initiaApi: InitiaApi) {
    this.actions = [new GenerateNftCollectionAction(this.initiaApi)];
  }
}
