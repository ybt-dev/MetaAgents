import { keyBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RESTClient, Wallet, MsgSend, MsgExecute, bcs, RawKey, Event } from '@initia/initia.js';
import { InjectEncryptionHelper } from '@libs/encryption/decorators';
import { EncryptionHelper } from '@libs/encryption/helpers';

export interface WalletBalance {
  amount: string;
  denom: string;
}

export interface TransactionResult {
  transactionId: string;
}

export interface SendTxParams {
  sender: string;
  recipient: string;
  amount: string;
  encryptedPrivateKey: string;
}

export interface CreateNftCollectionParams {
  encryptedPrivateKey: string;
  name: string;
  description: string;
  uri: string;
  maxSupply: number;
  royalty: number;
}

export interface CreateNftCollectionTransactionResult extends TransactionResult {
  collectionId?: string;
}

export interface MintNftParams {
  collectionName: string;
  description: string;
  tokenId: string;
  uri: string;
  recipient: string;
  encryptedPrivateKey: string;
}

export interface InitiaService {
  getWalletBalance(walletAddress: string): Promise<WalletBalance>;
  sendTx(params: SendTxParams): Promise<TransactionResult>;
  createNftCollection(params: CreateNftCollectionParams): Promise<CreateNftCollectionTransactionResult>;
  mintNft(params: MintNftParams): Promise<TransactionResult>;
}

@Injectable()
export class DefaultInitiaService implements InitiaService {
  private readonly INITIA_DENOM = 'uinit';
  private readonly NFT_MODULE_NAME = 'metaAgents_nft_module';
  private readonly NFT_MODULE_CREATE_COLLECTION_METHOD = 'create_collection';
  private readonly NFT_MODULE_MINT_NFT_METHOD = 'mint_nft';
  private readonly MOVE_EVENT_TYPE = 'move';
  private readonly NFT_CONTRACT_TYPE_TAG_KEY = 'type_tag';
  private readonly NFT_CONTRACT_DATA_TAG_KEY = 'data';
  private readonly CREATE_COLLECTION_TYPE_TAG_VALUE = '0x1::collection::CreateCollectionEvent';

  private readonly WALLET_ENCRYPTION_SECRET_KEY: string;
  private readonly NFT_CONTRACT_ADDRESS: string;

  constructor(
    private readonly client: RESTClient,
    @InjectEncryptionHelper() private readonly encryptionHelper: EncryptionHelper,
    private readonly configService: ConfigService,
  ) {
    this.WALLET_ENCRYPTION_SECRET_KEY = this.configService.getOrThrow<string>('WALLET_ENCRYPTION_SECRET_KEY');
    this.NFT_CONTRACT_ADDRESS = this.configService.getOrThrow<string>('NFT_CONTRACT_ADDRESS');
  }

  public async getWalletBalance(walletAddress: string) {
    const [coins] = await this.client.bank.balance(walletAddress);

    return {
      amount: coins.get('uinit')?.amount ?? '0',
      denom: this.INITIA_DENOM,
    };
  }

  public async sendTx(params: SendTxParams) {
    const wallet = this.getWalletFromPrivateKey(params.encryptedPrivateKey);

    const msgSend = new MsgSend(params.sender, params.recipient, params.amount);

    const signedTx = await wallet.createAndSignTx({ msgs: [msgSend], memo: '' });

    const result = await this.client.tx.broadcast(signedTx);

    return {
      transactionId: result.txhash,
    };
  }

  public async createNftCollection(params: CreateNftCollectionParams) {
    const wallet = this.getWalletFromPrivateKey(params.encryptedPrivateKey);

    const msg = new MsgExecute(
      wallet.key.accAddress,
      this.NFT_CONTRACT_ADDRESS,
      this.NFT_MODULE_NAME,
      this.NFT_MODULE_CREATE_COLLECTION_METHOD,
      undefined,
      [
        bcs.string().serialize(params.name).toBase64(),
        bcs.string().serialize(params.description).toBase64(),
        bcs.string().serialize(params.uri).toBase64(),
        bcs.u64().serialize(params.maxSupply).toBase64(),
        bcs.u64().serialize(params.royalty).toBase64(),
      ],
    );

    const signedTx = await wallet.createAndSignTx({ msgs: [msg] });

    const result = await this.client.tx.broadcast(signedTx);
    const transactionInfo = await this.client.tx.txInfo(result.txhash);

    return {
      transactionId: result.txhash,
      collectionId: this.getCollectionIdFromEvents(transactionInfo.events),
    };
  }

  public async mintNft(params: MintNftParams) {
    const wallet = this.getWalletFromPrivateKey(params.encryptedPrivateKey);

    const msg = new MsgExecute(
      wallet.key.accAddress,
      this.NFT_CONTRACT_ADDRESS,
      this.NFT_MODULE_NAME,
      this.NFT_MODULE_MINT_NFT_METHOD,
      undefined,
      [
        bcs.string().serialize(params.collectionName).toBase64(),
        bcs.string().serialize(params.description).toBase64(),
        bcs.string().serialize(params.tokenId).toBase64(),
        bcs.string().serialize(params.uri).toBase64(),
        bcs.address().serialize(params.recipient).toBase64(),
      ],
    );

    const signedTx = await wallet.createAndSignTx({ msgs: [msg] });

    const result = await this.client.tx.broadcast(signedTx);

    return { transactionId: result.txhash };
  }

  private getWalletFromPrivateKey(encryptedPrivateKey: string) {
    const decryptedPrivateKey = this.encryptionHelper.decrypt(encryptedPrivateKey, this.WALLET_ENCRYPTION_SECRET_KEY);

    return new Wallet(this.client, RawKey.fromHex(decryptedPrivateKey));
  }

  private getCollectionIdFromEvents(events: Event[]) {
    for (const event of events) {
      if (event.type === this.MOVE_EVENT_TYPE) {
        const composedAttributes = keyBy(event.attributes, 'key');

        const typeTag = composedAttributes[this.NFT_CONTRACT_TYPE_TAG_KEY]?.value;
        const data = composedAttributes[this.NFT_CONTRACT_DATA_TAG_KEY]?.value;

        if (typeTag === this.CREATE_COLLECTION_TYPE_TAG_VALUE && data) {
          const parsedData = JSON.parse(data);

          return parsedData.collection;
        }
      }
    }

    return undefined;
  }
}
