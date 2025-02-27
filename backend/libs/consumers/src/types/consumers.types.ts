import { AnyObject } from '@libs/types';

export interface Consumer {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface ConsumerMessage<Payload extends AnyObject = AnyObject> {
  messageId: string;
  deduplicationId: string;
  payload: Payload;
  correlationId?: string;
}
