import { MessageAttributeValue, PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Publisher, PublishMessageParams } from '../types';

export interface PublisherFactory {
  createPublisher(publisherName: string): Publisher;
}

export class SnsPublisherFactory implements PublisherFactory {
  private snsClient = new SNSClient();

  constructor(private config: Record<string, string>) {}

  public createPublisher(publisherName: string) {
    const topicArn = this.config[publisherName];

    if (!topicArn) {
      throw new Error(`Topic ARN for publisher ${publisherName} is not provided.`);
    }

    return {
      publish: async (params: PublishMessageParams) => {
        const customMessageAttributes = Object.keys(params.messageAttributes || {}).reduce(
          (previousCustomMessageAttributes, key) => {
            previousCustomMessageAttributes[key] = {
              DataType: 'String',
              StringValue: (params.messageAttributes || {})[key],
            };

            return previousCustomMessageAttributes;
          },
          {} as Record<string, MessageAttributeValue>,
        );

        const command = new PublishCommand({
          TopicArn: topicArn,
          Message: JSON.stringify(params.data),
          MessageAttributes: {
            ...customMessageAttributes,
            ...(params.deduplicationId
              ? { DeduplicationId: { DataType: 'String', StringValue: params.deduplicationId } }
              : {}),
            ...(params.correlationId
              ? {
                  CorrelationId: {
                    DataType: 'String',
                    StringValue: params.correlationId,
                  },
                }
              : {}),
          },
        });

        await this.snsClient.send(command);
      },
    };
  }
}
