import { MongoClient } from 'mongodb';
import { MongoDBDatabaseAdapter } from '@elizaos/adapter-mongodb';
import { elizaLogger } from '@elizaos/core';
import { configDotenv } from 'dotenv';
import InteractionsClient from './clients/interactions.client.ts';
import { DefaultAgentsStore } from './stores/agents.store.ts';
import { DefaultAgentsManager } from './managers/agents.manager.ts';
import {
  AgentConfigurationsRepository,
  MongodbAgentConfigurationsRepository,
} from './repositories/agent-configurations.repository.ts';
import { MongodbAgentTeamInteractionsRepository } from './repositories/agent-team-interactions.repository.ts';
import { DefaultEncryptionHelper } from './helpers/encryption.helper.ts';
import { ObjectIdGenerationHelper } from './helpers/id-generation.helper.ts';
import { CharacterFactory, DefaultCharacterFactory } from './factories/character.factory.ts';
import { SqsConsumerFactory } from './factories/consumer.factory.ts';
import { SnsPublisherFactory } from './factories/publisher.factory.ts';
import { DefaultAgentsControlService } from './services/agents-control.service.ts';
import AgentRole from './enums/agent-role.enum.ts';
import ConsumerName from './enums/consumer-name.enum.ts';
import PublisherName from './enums/publisher-name.enum.ts';
import producerTemplate from './character-templates/producer.template.ts';
import adviserCharacterTemplate from './character-templates/advertiser.template.ts';
import influencerCharacterTemplate from './character-templates/influencer.template.ts';

configDotenv();

process.on('uncaughtException', (error) => {
  console.error(error);
});

process.on('unhandledRejection', (promise) => {
  console.error(promise);
});

const initializeDatabaseClient = () => {
  const DATABASE_URL = process.env.MONGODB_URL || '';

  return new MongoClient(DATABASE_URL);
};

const loadCharacters = async (
  agentConfigurationsRepository: AgentConfigurationsRepository,
  characterFactory: CharacterFactory,
) => {
  const agentConfigurations = await agentConfigurationsRepository.findAll();

  return agentConfigurations.map((agentConfiguration) => {
    return [characterFactory.createCharacter(agentConfiguration), agentConfiguration] as const;
  });
};

const initializeAgentsSystem = async () => {
  const databaseClient = initializeDatabaseClient();

  const databaseName = process.env.MONGODB_NAME || 'meta-agents';

  const elizaMongodbAdapter = new MongoDBDatabaseAdapter(databaseClient, databaseName);

  await elizaMongodbAdapter.init();

  const database = databaseClient.db(databaseName);

  const agentConfigurationsRepository = new MongodbAgentConfigurationsRepository(database);
  const agentTeamInteractionsRepository = new MongodbAgentTeamInteractionsRepository(database);

  const agentsStore = new DefaultAgentsStore();
  const encryptionHelper = new DefaultEncryptionHelper();
  const idGenerationHelper = new ObjectIdGenerationHelper();

  const sqsConsumerFactory = new SqsConsumerFactory({
    [ConsumerName.Interactions]: process.env.INTERACTIONS_QUEUE_URL || '',
    [ConsumerName.AgentsControl]: process.env.AGENTS_CONTROL_QUEUE_URL || '',
  });

  const snsPublisherFactory = new SnsPublisherFactory({
    [PublisherName.InteractionResponse]: process.env.INTERACTION_RESPONSE_TOPIC_ARN || '',
    [PublisherName.AgentsCommunication]: process.env.AGENTS_COMMUNICATION_ARN || '',
  });

  const agentsManager = new DefaultAgentsManager(agentsStore, elizaMongodbAdapter, elizaMongodbAdapter);

  const interactionsClient = new InteractionsClient(
    agentsManager,
    sqsConsumerFactory,
    snsPublisherFactory,
    idGenerationHelper,
  );

  const characterFactory = new DefaultCharacterFactory(
    agentConfigurationsRepository,
    agentTeamInteractionsRepository,
    agentsManager,
    snsPublisherFactory,
    encryptionHelper,
    {
      [AgentRole.Producer]: producerTemplate,
      [AgentRole.Adviser]: adviserCharacterTemplate,
      [AgentRole.Influencer]: influencerCharacterTemplate,
    },
  );

  const agentsControlService = new DefaultAgentsControlService(sqsConsumerFactory, characterFactory, agentsManager);

  await interactionsClient.start();
  await agentsControlService.start();

  elizaLogger.info('Starting agents...');

  const data = await loadCharacters(agentConfigurationsRepository, characterFactory);

  for (const [character, configuration] of data) {
    await agentsManager.startAgent(character, configuration);
  }

  elizaLogger.success('Agents initialized!');
};

initializeAgentsSystem().catch((error) => {
  console.error('Unhandled error in startAgents:', error);

  if (error instanceof Error) {
    console.error(error.stack);
  }
});
