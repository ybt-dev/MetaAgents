import { ModelProviderName } from '@elizaos/core';
import { Collection, Db, ObjectId } from 'mongodb';
import { AgentConfiguration } from '../types';
import AgentRole from '../enums/agent-role.enum.ts';

interface AgentConfigurationDocument {
  _id: ObjectId;
  name: string;
  role: AgentRole;
  organization: ObjectId;
  team: ObjectId;
  description?: string;
  model: ModelProviderName;
  modelApiKey: string;
  encryptedPrivateKey: string;
  walletAddress: string;
  config: Record<string, string | number>;
}

export interface AgentConfigurationsRepository {
  findAll(): Promise<AgentConfiguration[]>;
  findByOrganizationIdAndTeamId(organizationId: string, teamId: string): Promise<AgentConfiguration[]>;
}

export class MongodbAgentConfigurationsRepository implements AgentConfigurationsRepository {
  private collection: Collection<AgentConfigurationDocument>;

  constructor(private database: Db) {
    this.collection = this.database.collection('agents');
  }

  public async findByOrganizationIdAndTeamId(organizationId: string, teamId: string) {
    const agentConfigurationDocuments = await this.collection
      .find({
        organization: new ObjectId(organizationId),
        team: new ObjectId(teamId),
      })
      .toArray();

    return agentConfigurationDocuments.map((agentConfigurationDocument) => {
      return this.mapDocumentToViewModel(agentConfigurationDocument);
    });
  }

  public async findAll(): Promise<AgentConfiguration[]> {
    const agentConfigurationDocuments = await this.collection.find().toArray();

    return agentConfigurationDocuments.map((agentConfigurationDocument) => {
      return this.mapDocumentToViewModel(agentConfigurationDocument);
    });
  }

  private mapDocumentToViewModel(agentConfigurationDocument: AgentConfigurationDocument): AgentConfiguration {
    return {
      id: agentConfigurationDocument._id.toString(),
      name: agentConfigurationDocument.name,
      role: agentConfigurationDocument.role,
      teamId: agentConfigurationDocument.team.toString(),
      walletAddress: agentConfigurationDocument.walletAddress,
      encryptedPrivateKey: agentConfigurationDocument.encryptedPrivateKey,
      organizationId: agentConfigurationDocument.organization.toString(),
      description: agentConfigurationDocument.description,
      model: agentConfigurationDocument.model,
      modelApiKey: agentConfigurationDocument.modelApiKey,
      config: agentConfigurationDocument.config,
    };
  }
}
