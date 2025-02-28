import { AnyObject } from './common.types';

export interface PublishMessageParams {
  deduplicationId?: string;
  data: AnyObject;
  correlationId?: string;
  messageAttributes?: Record<string, string>;
}

export interface Publisher {
  publish(params: PublishMessageParams): Promise<void>;
}
