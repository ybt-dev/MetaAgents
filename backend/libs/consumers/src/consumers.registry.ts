import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { InjectIdempotencyService } from '@libs/idempotency/decorators';
import { IdempotencyService } from '@libs/idempotency/services';
import { IdempotencyConflictError } from '@libs/idempotency/errors';
import { CONSUMER_METHOD_METADATA_KEY } from './constants';
import { Consumer, ConsumerMetadata, ConsumerMessage } from './types';

type RegisterCallback = (callback: (message: ConsumerMessage) => Promise<void>) => Consumer;

export interface ConsumersRegistry {
  register(name: string, callback: RegisterCallback): void;
}

@Injectable()
export class DefaultConsumersRegistry implements OnApplicationBootstrap, OnApplicationShutdown, ConsumersRegistry {
  private readonly registeredCallbacks = new Map<string, RegisterCallback>();
  private readonly registeredConsumers = new Map<string, Consumer>();
  private readonly logger = new Logger('ConsumersRegistry', { timestamp: false });

  public constructor(
    private readonly discoveryService: DiscoveryService,
    @InjectIdempotencyService() private idempotencyService: IdempotencyService,
  ) {}

  public register(name: string, callback: RegisterCallback) {
    this.registeredCallbacks.set(name, callback);
  }

  public async onApplicationBootstrap() {
    const messageHandlers =
      await this.discoveryService.providerMethodsWithMetaAtKey<ConsumerMetadata>(CONSUMER_METHOD_METADATA_KEY);

    for (const metadata of messageHandlers) {
      const {
        discoveredMethod,
        meta: { name: consumerName, disableIdempotency, idempotencyLockDuration },
      } = metadata;

      const {
        handler,
        parentClass: { instance: consumerInstance },
      } = discoveredMethod;

      const registerCallback = this.registeredCallbacks.get(consumerName);

      if (!registerCallback) {
        this.logger.warn(`Consumer not found: ${consumerName}`);

        throw new Error(`Consumer not found: ${consumerName}`);
      }

      const consume = handler.bind(consumerInstance);

      const consumer = registerCallback(async (message) => {
        this.logger.log(`Processing message: ${consumerName} - ${message.messageId}`);

        try {
          const result = await this.idempotencyService.useIdempotentOperation(
            message.deduplicationId,
            async () => {
              return await consume(message);
            },
            {
              skip: disableIdempotency,
              lockDuration: idempotencyLockDuration,
            },
          );

          this.logger.log(`Message processed: ${consumerName} - ${message.messageId}`);

          return result;
        } catch (error) {
          if (error instanceof IdempotencyConflictError) {
            this.logger.error(`Idempotency conflict: ${consumerName} - ${message.messageId}`);
            return;
          }

          this.logger.error(`Error processing message: ${consumerName}`, error);

          throw error;
        }
      });

      await consumer.start();

      this.registeredConsumers.set(metadata.meta.name, consumer);

      this.logger.log(`Consumer started: ${metadata.meta.name}`);
    }
  }

  public async onApplicationShutdown() {
    for (const consumer of this.registeredConsumers.values()) {
      await consumer.stop();
    }
  }
}
