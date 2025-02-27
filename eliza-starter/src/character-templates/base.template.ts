import { Character, defaultCharacter, ModelProviderName } from '@elizaos/core';
import { AgentConfiguration } from '../types';
import { EncryptionHelper } from '../helpers/encryption.helper.ts';

const getSecretsByModel = (model: ModelProviderName, modelApiKey: string) => {
  switch (model) {
    case ModelProviderName.OPENAI: {
      return {
        OPENAI_API_KEY: modelApiKey,
      };
    }
    case ModelProviderName.OPENROUTER: {
      return {
        OPENROUTER: modelApiKey,
      };
    }
    default: {
      return {};
    }
  }
};

const baseCharacterTemplate = (
  encryptionHelper: EncryptionHelper,
  agentConfiguration: AgentConfiguration,
  characterData: Partial<Character>,
): Character => {
  return {
    ...defaultCharacter,
    modelProvider: agentConfiguration.model,
    id: agentConfiguration.id as Character['id'],
    name: agentConfiguration.name,
    settings: {
      secrets: {
        TWITTER_COOKIES: agentConfiguration.config.twitterCookie,
        TWITTER_USERNAME: agentConfiguration.config.twitterUsername,
        TWITTER_PASSWORD: agentConfiguration.config.twitterPassword,
        TWITTER_EMAIL: agentConfiguration.config.twitterEmail,
        ...getSecretsByModel(agentConfiguration.model, agentConfiguration.modelApiKey),
      },
    },
    ...characterData,
  } as Character;
};

export default baseCharacterTemplate;
