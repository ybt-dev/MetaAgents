import { ModelProviderName } from '@elizaos/core';
import AgentRole from '../enums/agent-role.enum.ts';

export interface AgentConfiguration {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  model: ModelProviderName;
  organizationId: string;
  teamId: string;
  modelApiKey: string;
  walletAddress: string;
  encryptedPrivateKey: string;
  config: Record<string, string | number>;
}
