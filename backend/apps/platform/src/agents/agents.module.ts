import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from '@libs/transactions';
import { EventsModule } from '@libs/events';
import { EncryptionModule } from '@libs/encryption';
import { DeduplicationModule } from '@libs/deduplication';
import {
  AgentTeam,
  Agent,
  AgentTeamInteraction,
  InteractionMessage,
  AgentTeamSchema,
  AgentSchema,
  AgentTeamInteractionSchema,
  InteractionMessageSchema,
} from './schemas';
import {
  DefaultAgentService,
  DefaultAgentTeamService,
  DefaultAgentTeamInteractionService,
  DefaultInteractionMessageService,
  DefaultAgentCommunicationRepliesService,
} from './services';
import {
  AgentTeamController,
  AgentController,
  AgentTeamInteractionController,
  InteractionMessageController,
} from './controllers';
import {
  MongoAgentRepository,
  MongoAgentTeamInteractionRepository,
  MongoAgentTeamRepository,
  MongoInteractionMessageRepository,
} from './repositories';
import {
  DefaultAgentEntityToDtoMapper,
  DefaultAgentTeamEntityToDtoMapper,
  DefaultAgentTeamInteractionEntityToDtoMapper,
  DefaultInteractionMessageEntityToDtoMapper,
} from './entities-mappers';
import { AgentCommunicationRepliesConsumer } from './consumers';
import AgentsModuleTokens from './agents.module.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AgentTeam.name, schema: AgentTeamSchema }]),
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
    MongooseModule.forFeature([{ name: AgentTeamInteraction.name, schema: AgentTeamInteractionSchema }]),
    MongooseModule.forFeature([{ name: InteractionMessage.name, schema: InteractionMessageSchema }]),
    ConfigModule,
    TransactionsModule,
    EventsModule,
    EncryptionModule,
    DeduplicationModule,
  ],
  controllers: [AgentTeamController, AgentController, AgentTeamInteractionController, InteractionMessageController],
  providers: [
    AgentCommunicationRepliesConsumer,
    {
      provide: AgentsModuleTokens.Services.AgentTeamService,
      useClass: DefaultAgentTeamService,
    },
    {
      provide: AgentsModuleTokens.Repositories.AgentTeamRepository,
      useClass: MongoAgentTeamRepository,
    },
    {
      provide: AgentsModuleTokens.EntityMappers.AgentTeamEntityToDtoMapper,
      useClass: DefaultAgentTeamEntityToDtoMapper,
    },
    {
      provide: AgentsModuleTokens.Services.AgentService,
      useClass: DefaultAgentService,
    },
    {
      provide: AgentsModuleTokens.Repositories.AgentRepository,
      useClass: MongoAgentRepository,
    },
    {
      provide: AgentsModuleTokens.EntityMappers.AgentEntityToDtoMapper,
      useClass: DefaultAgentEntityToDtoMapper,
    },
    {
      provide: AgentsModuleTokens.Repositories.AgentTeamInteractionRepository,
      useClass: MongoAgentTeamInteractionRepository,
    },
    {
      provide: AgentsModuleTokens.Services.AgentTeamInteractionService,
      useClass: DefaultAgentTeamInteractionService,
    },
    {
      provide: AgentsModuleTokens.EntityMappers.AgentTeamInteractionEntityToDtoMapper,
      useClass: DefaultAgentTeamInteractionEntityToDtoMapper,
    },
    {
      provide: AgentsModuleTokens.Repositories.InteractionMessageRepository,
      useClass: MongoInteractionMessageRepository,
    },
    {
      provide: AgentsModuleTokens.Services.InteractionMessageService,
      useClass: DefaultInteractionMessageService,
    },
    {
      provide: AgentsModuleTokens.EntityMappers.InteractionMessageEntityToDtoMapper,
      useClass: DefaultInteractionMessageEntityToDtoMapper,
    },
    {
      provide: AgentsModuleTokens.Services.AgentCommunicationRepliesServiceService,
      useClass: DefaultAgentCommunicationRepliesService,
    },
  ],
  exports: [
    AgentsModuleTokens.Services.AgentTeamService,
    AgentsModuleTokens.Services.AgentService,
    AgentsModuleTokens.Services.AgentTeamInteractionService,
    AgentsModuleTokens.Services.InteractionMessageService,
  ],
})
export class AgentsModule {
  public static Tokens = AgentsModuleTokens;
}
