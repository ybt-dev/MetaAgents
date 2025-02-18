import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from '@libs/transactions';
import {
  AgentTeam,
  Agent,
  AgentTeamInteraction,
  AgentMessage,
  AgentTeamSchema,
  AgentSchema,
  AgentTeamInteractionSchema,
  AgentMessageSchema,
} from './schemas';
import {
  DefaultAgentService,
  DefaultAgentTeamService,
  DefaultAgentTeamInteractionService,
  DefaultAgentMessageService,
} from './services';
import {
  AgentTeamController,
  AgentController,
  AgentTeamInteractionController,
  AgentMessageController,
} from './controllers';
import {
  MongoAgentRepository,
  MongoAgentTeamInteractionRepository,
  MongoAgentTeamRepository,
  MongoAgentMessageRepository,
} from './repositories';
import {
  DefaultAgentEntityToDtoMapper,
  DefaultAgentTeamEntityToDtoMapper,
  DefaultAgentTeamInteractionEntityToDtoMapper,
  DefaultAgentMessageEntityToDtoMapper,
} from './entities-mappers';
import { ElizaRestApi } from './api';
import AgentsModuleTokens from './agents.module.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AgentTeam.name, schema: AgentTeamSchema }]),
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
    MongooseModule.forFeature([{ name: AgentTeamInteraction.name, schema: AgentTeamInteractionSchema }]),
    MongooseModule.forFeature([{ name: AgentMessage.name, schema: AgentMessageSchema }]),
    ConfigModule,
    TransactionsModule,
  ],
  controllers: [AgentTeamController, AgentController, AgentTeamInteractionController, AgentMessageController],
  providers: [
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
      provide: AgentsModuleTokens.Repositories.AgentMessageRepository,
      useClass: MongoAgentMessageRepository,
    },
    {
      provide: AgentsModuleTokens.Services.AgentMessageService,
      useClass: DefaultAgentMessageService,
    },
    {
      provide: AgentsModuleTokens.EntityMappers.AgentMessageEntityToDtoMapper,
      useClass: DefaultAgentMessageEntityToDtoMapper,
    },
    {
      provide: AgentsModuleTokens.Api.ElizaApi,
      useClass: ElizaRestApi,
    },
  ],
  exports: [
    AgentsModuleTokens.Services.AgentTeamService,
    AgentsModuleTokens.Services.AgentService,
    AgentsModuleTokens.Services.AgentTeamInteractionService,
    AgentsModuleTokens.Services.AgentMessageService,
  ],
})
export class AgentsModule {
  public static Tokens = AgentsModuleTokens;
}
