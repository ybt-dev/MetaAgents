import { elizaLogger } from '@elizaos/core';
import { Consumer as SqsConsumer } from 'sqs-consumer';
import { Consumer, ConsumerMessage } from '../types';

export interface ConsumerFactory {
  createConsumer(name: string, handleMessage: (message: ConsumerMessage) => Promise<void>): Consumer;
}

export class SqsConsumerFactory implements ConsumerFactory {
  private CORRELATION_ID_MESSAGE_ATTRIBUTE_NAME = 'CorrelationId' as const;
  private DEDUPLICATION_ID_MESSAGE_ATTRIBUTE_NAME = 'DeduplicationId' as const;

  constructor(private urlsConfig: Record<string, string>) {}

  public createConsumer(name: string, handleMessage: (message: ConsumerMessage) => Promise<void>) {
    const queueUrl = this.urlsConfig[name];

    if (!queueUrl) {
      throw new Error(`Queue URL for consumer ${name} is not provided.`);
    }

    const sqsConsumer = SqsConsumer.create({
      queueUrl,
      handleMessage: async (message) => {
        const messageId = message.MessageId;

        if (!messageId) {
          elizaLogger.log(`Message ID is not provided for consumer: ${name}`);

          throw new Error('Message ID is required');
        }

        const correlationId = message.MessageAttributes?.[this.CORRELATION_ID_MESSAGE_ATTRIBUTE_NAME]?.StringValue;
        const deduplicationId =
          message.MessageAttributes?.[this.DEDUPLICATION_ID_MESSAGE_ATTRIBUTE_NAME]?.StringValue || messageId;

        return handleMessage({
          messageId,
          payload: JSON.parse(message.Body),
          correlationId,
          deduplicationId,
        });
      },
    });

    return {
      start: async () => sqsConsumer.start(),
      stop: async () => sqsConsumer.stop(),
    };
  }
}
