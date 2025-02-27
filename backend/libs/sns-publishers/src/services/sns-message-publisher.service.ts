import { Injectable } from '@nestjs/common';
import { PublishCommand, SNSClient, MessageAttributeValue } from '@aws-sdk/client-sns';
import { MessagePublisherService, PublishMessageParams } from '@libs/publishers/services';
import { InjectSnsClient } from '@libs/sns/decorators';
import { InjectSnsPublishersConfig } from '@libs/sns-publishers/decorators';
import { SnsPublishersConfig } from '@libs/sns-publishers/types';

@Injectable()
export class SnsMessagePublisherService implements MessagePublisherService {
  constructor(
    @InjectSnsClient() private snsClient: SNSClient,
    @InjectSnsPublishersConfig() private config: SnsPublishersConfig,
  ) {}

  public async publish(params: PublishMessageParams) {
    const publisherConfig = this.config[params.publishKey];

    if (!publisherConfig) {
      throw new Error(`Publisher for "${params.publishKey}" key is not found`);
    }

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
      TopicArn: publisherConfig.topicArn,
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
  }
}
