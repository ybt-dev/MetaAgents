import { Character, defaultCharacter, ModelProviderName } from '@elizaos/core';
import AgentSettingsKey from '../enums/agent-settings-key.enum.ts';
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
  const encryptionSecret = process.env.WALLET_ENCRYPTION_SECRET_KEY;

  if (!encryptionSecret) {
    throw new Error('Wallet encryption secret is missing');
  }

  const privateKey = encryptionHelper.decrypt(agentConfiguration.encryptedPrivateKey, encryptionSecret);

  return {
    ...defaultCharacter,
    modelProvider: agentConfiguration.model,
    id: agentConfiguration.id as Character['id'],
    name: agentConfiguration.name,
    imageModelProvider: ModelProviderName.TOGETHER,
    settings: {
      secrets: {
        [AgentSettingsKey.InitiaPrivateKey]: privateKey,
        [AgentSettingsKey.InitiaEncryptedPrivateKey]: agentConfiguration.encryptedPrivateKey,
        [AgentSettingsKey.InitiaWalletAddress]: agentConfiguration.walletAddress,
        TWITTER_AUTH_TOKEN: agentConfiguration.config.twitterAuthToken,
        TWITTER_USERNAME: agentConfiguration.config.twitterUsername,
        TWITTER_PASSWORD: agentConfiguration.config.twitterPassword,
        TWITTER_EMAIL: agentConfiguration.config.twitterEmail,
        TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
        ...getSecretsByModel(agentConfiguration.model, agentConfiguration.modelApiKey),
      },
    },
    ...characterData,
  } as Character;
};

export default baseCharacterTemplate;
