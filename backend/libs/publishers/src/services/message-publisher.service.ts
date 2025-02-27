import { AnyObject } from '@libs/types';

export interface PublishMessageParams {
  publishKey: string;
  deduplicationId?: string;
  data: AnyObject;
  correlationId?: string;
  messageAttributes?: Record<string, string>;
}

export interface MessagePublisherService {
  publish(params: PublishMessageParams): Promise<void>;
}
