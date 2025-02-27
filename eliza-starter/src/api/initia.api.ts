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

// Temporary solution, cause initia.js is broken in ESM modules.
export interface InitiaApi {
  sendAmount(params: SendAmountParams): Promise<TransactionResult>;
  getWalletBalance(walletAddress: string): Promise<WalletBalance>;
  createNftCollection(params: CreateNftCollectionParams): Promise<TransactionResult>;
}

export class RestInitiaApi implements InitiaApi {
  constructor(private restApiClient: RestApiClient) {}

  public sendAmount(params: SendAmountParams) {
    return this.restApiClient.makeCall<TransactionResult>('/send-amount', 'POST', params);
  }

  public async getWalletBalance(walletAddress: string) {
    return this.restApiClient.makeCall<WalletBalance>(`/balance?walletAddress=${walletAddress}`, 'GET');
  }

  public createNftCollection(params: CreateNftCollectionParams) {
    return this.restApiClient.makeCall<TransactionResult>('/create-collection', 'POST', params);
  }
}
