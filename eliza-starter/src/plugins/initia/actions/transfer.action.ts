import {
  Action,
  composeContext,
  Content,
  elizaLogger,
  generateObject,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  ModelClass,
  State,
} from '@elizaos/core';
import AgentSettingsKey from '../../../enums/agent-settings-key.enum.ts';
import { InitiaApi } from '../../../api/initia.api.ts';
import { transferActionTemplate } from '../templates/action.templates.ts';
import initiaTransferSchema from '../schemas/transfer.schema.ts';

export interface TransferContent extends Content {
  sender: string;
  recipient: string;
  amount: string;
}

export default class InitiaTransferAction implements Action {
  public name = 'SEND_TOKEN';
  public description = '';

  public similes = [
    'TRANSFER_TOKEN_ON_INITIA',
    'TRANSFER_TOKENS_ON_INITIA',
    'SEND_TOKEN_ON_INITIA',
    'SEND_TOKENS_ON_INITIA',
    'PAY_ON_INITIA',
  ];

  public examples = [
    [
      {
        user: '{{user1}}',
        content: {
          text: 'Hey send 1 INIT to init18sj3x80fdjc6gzfvwl7lf8sxcvuvqjpvcmp6np.',
        },
      },
      {
        user: '{{user2}}',
        content: {
          text: 'Sure! I am going to send 1 INIT to init18sj3x80fdjc6gzfvwl7lf8sxcvuvqjpvcmp6np.',
        },
      },
    ],
  ];

  constructor(private initiaApi: InitiaApi) {}

  public async validate(runtime: IAgentRuntime) {
    return !!runtime.getSetting(AgentSettingsKey.InitiaEncryptedPrivateKey);
  }

  public async handler(
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    options?: Record<string, unknown>,
    callback?: HandlerCallback,
  ) {
    const currentState = state ? await runtime.updateRecentMessageState(state) : await runtime.composeState(message);

    const transferContext = composeContext({
      state: currentState,
      template: transferActionTemplate,
    });

    const content = await generateObject({
      runtime,
      context: transferContext,
      modelClass: ModelClass.LARGE,
      schema: initiaTransferSchema,
    });

    if (!this.isTransferContent(content)) {
      await callback?.({
        text: 'Unable to process transfer request. Invalid content provided.',
        content: { error: 'Invalid transfer content' },
      });

      return false;
    }

    try {
      const encryptedPrivateKey = runtime.getSetting(AgentSettingsKey.InitiaEncryptedPrivateKey);

      const { transactionId } = await this.initiaApi.sendAmount({
        sender: content.sender,
        recipient: content.recipient,
        amount: content.amount,
        encryptedPrivateKey,
      });

      await callback?.({
        text: `Successfully transferred INITIA.
  Transaction Hash: ${transactionId}
  Sender: ${content.sender}
  Recipient: ${content.recipient}
  Amount: ${content.amount}`,
        content: { transactionId, sender: content.sender, recipient: content.recipient, amount: content.amount },
      });

      return true;
    } catch (error) {
      elizaLogger.error('Failed to transfer INITIA:', error.message);

      await callback?.({
        text: `Failed to transfer INITIA: ${error.message}`,
        content: { error: error.message },
      });

      return false;
    }
  }

  private isTransferContent(content: unknown): content is TransferContent {
    return (
      typeof content === 'object' &&
      content !== null &&
      'sender' in content &&
      typeof content.sender === 'string' &&
      'recipient' in content &&
      typeof content.recipient === 'string' &&
      'amount' in content &&
      content.amount === 'number'
    );
  }
}
