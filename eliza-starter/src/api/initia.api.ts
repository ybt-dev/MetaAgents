import { RestApiClient } from './clients/rest-api.client.ts';

export interface WalletBalance {
  amount: string;
  denom: string;
}

export interface SendAmountParams {
  sender: string;
  recipient: string;
  amount: string;
  encryptedPrivateKey: string;
}

export interface TransactionLog {
  events: Array<{
    type: string;
    attributes: Array<{
      key: string;
      value: string;
    }>;
  }>;
}

export interface TransactionResult {
  transactionId: string;
  logs: TransactionLog[];
}

export interface CreateNftCollectionParams {
  encryptedPrivateKey: string;
  name: string;
  description: string;
  uri: string;
  maxSupply: number;
  royalty: number;
}

export interface MintNftParams {
  collectionName: string;
  description: string;
  tokenId: string;
  uri: string;
  recipient: string;
  encryptedPrivateKey: string;
}
// Temporary solution, cause initia.js is broken in ESM modules.
export interface InitiaApi {
  sendAmount(params: SendAmountParams): Promise<TransactionResult>;
  getWalletBalance(walletAddress: string): Promise<WalletBalance>;
  createNftCollection(params: CreateNftCollectionParams): Promise<TransactionResult>;
  mintNft(params: MintNftParams): Promise<TransactionResult>;
}

export class RestInitiaApi implements InitiaApi {
  constructor(private restApiClient: RestApiClient) {}

  public sendAmount(params: SendAmountParams) {
    return this.restApiClient.makeCall<TransactionResult>('/initia/send-amount', 'POST', params);
  }

  public async getWalletBalance(walletAddress: string) {
    return this.restApiClient.makeCall<WalletBalance>(`/initia/balance?walletAddress=${walletAddress}`, 'GET');
  }

  public createNftCollection(params: CreateNftCollectionParams) {
    return this.restApiClient.makeCall<TransactionResult>('/initia/create-collection', 'POST', params);
  }

  public mintNft(params: MintNftParams) {
    return this.restApiClient.makeCall<TransactionResult>('/initia/mint-nft', 'POST', params);
  }
}
