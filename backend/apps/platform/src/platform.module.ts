// This module should be imported first.
import './instrument';

import * as Joi from 'joi';
import Redis from 'ioredis';
import { getRedisConnectionToken, RedisModule } from '@nestjs-modules/ioredis';
import { SentryModule } from '@sentry/nestjs/setup';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from '@libs/health';
import { LoggerMiddleware } from '@libs/logging/middlewares';
import { TransactionsModule } from '@libs/transactions';
import { IdempotencyModule } from '@libs/idempotency';
import { SqsModule } from '@libs/sqs';
import { SnsModule } from '@libs/sns';
import { PublishersModule } from '@libs/publishers';
import { SnsMessagePublisherService, SnsPublishersModule } from '@libs/sns-publishers';
import { SqsConsumersModule } from '@libs/sqs-consumers';
import { LockModule } from '@libs/lock';
import { RedisLockModule, RedisLockService } from '@libs/redis-lock';
import { MongodbTransactionsManager, MongodbTransactionsModule } from '@libs/mongodb-transactions';
import { AgentsModule } from '@apps/platform/agents';
import { SessionsModule } from '@apps/platform/sessions';
import { InitiaModule } from '@apps/platform/initia';
import {
  AgentEventType,
  AgentsConsumerName,
  AgentsEventCategory,
  AgentTeamInteractionsEventType,
} from '@apps/platform/agents/enums';

@Module({
  imports: [
    HealthModule,
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3000),
        DATABASE_CONNECTION_URL: Joi.string().required(),
        APPLICATION_ORIGIN: Joi.string().required(),
        COOKIE_DOMAIN: Joi.string().optional(),
        SESSIONS_SECRET: Joi.string().required(),
        SESSION_TOKEN_EXPIRES_IN: Joi.number().required(),
        WALLET_ENCRYPTION_SECRET_KEY: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        SNS_BASE_ARN: Joi.string().required(),
        SQS_BASE_URL: Joi.string().required(),
        NFT_CONTRACT_ADDRESS: Joi.string().required(),
        INITIA_NODE_URL: Joi.string().optional().default('https://lcd.initiation-2.initia.xyz/'),
        INITIA_CHAIN_ID: Joi.string().optional().default('initiation-2'),
      }),
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_CONNECTION_URL'),
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.getOrThrow('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    LockModule.forRoot({
      imports: [RedisLockModule],
      useExistingLockService: RedisLockService,
    }),
    SqsModule.forRootAsync({
      imports: [ConfigModule],
      useConfigFactory: (configService: ConfigService) => {
        return {
          region: configService.getOrThrow('AWS_REGION'),
          credentials: {
            accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
          },
        };
      },
      inject: [ConfigService],
    }),
    SnsModule.forRootAsync({
      imports: [ConfigModule],
      useConfigFactory: (configService: ConfigService) => {
        return {
          region: configService.getOrThrow('AWS_REGION'),
          credentials: {
            accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
          },
        };
      },
      inject: [ConfigService],
    }),
    PublishersModule.forRoot({
      publisherNames: ['events'],
      imports: [
        SnsPublishersModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            const SNS_BASE_ARN = configService.get('SNS_BASE_ARN');

            const config = [
              {
                topicArn: `${SNS_BASE_ARN}agent-communication-requests`,
                eventType: AgentTeamInteractionsEventType.AgentCommunicationRequested,
                eventCategory: AgentsEventCategory.AgentTeamInteractions,
              },
              {
                topicArn: `${SNS_BASE_ARN}test-agent-creation`,
                eventType: AgentEventType.AgentCreated,
                eventCategory: AgentsEventCategory.Agents,
              },
              {
                topicArn: `${SNS_BASE_ARN}test-agent-deletes`,
                eventType: AgentEventType.AgentDeleted,
                eventCategory: AgentsEventCategory.Agents,
              },
              {
                topicArn: `${SNS_BASE_ARN}test-agent-updates`,
                eventType: AgentEventType.AgentUpdated,
                eventCategory: AgentsEventCategory.Agents,
              },
            ];

            return config.reduce(
              (previousMapping, { topicArn, eventType, eventCategory }) => {
                previousMapping[`${eventCategory}.${eventType}`] = { topicArn };

                return previousMapping;
              },
              {} as Record<string, { topicArn: string }>,
            );
          },
          inject: [ConfigService],
        }),
      ],
      useExistingPublisherService: SnsMessagePublisherService,
    }),
    IdempotencyModule.forRootAsync({
      imports: [RedisModule],
      useFactory: (redis: Redis) => ({ redis }),
      inject: [getRedisConnectionToken()],
    }),
    SqsConsumersModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const sqsBaseUrl = configService.getOrThrow('SQS_BASE_URL');

        return [
          {
            name: AgentsConsumerName.AgentCommunicationReplies,
            queueUrl: `${sqsBaseUrl}meta-agents-communication-replies-processing`,
          },
        ];
      },
      inject: [ConfigService],
    }),
    TransactionsModule.forRoot({
      imports: [MongodbTransactionsModule],
      useExistingTransactionsManager: MongodbTransactionsManager,
    }),
    InitiaModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          nodeUrl: configService.getOrThrow('INITIA_NODE_URL'),
          chainId: configService.getOrThrow('INITIA_CHAIN_ID'),
        };
      },
      inject: [ConfigService],
    }),
    AgentsModule,
    SessionsModule,
  ],
})
export class PlatformModule {
  constructor() {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).exclude('/health').forRoutes('*');
  }
}
