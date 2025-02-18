import { AgentDto } from '@apps/platform/agents/dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export interface AgentsChangePayload {
  type: 'add' | 'remove' | 'update';
  agent: AgentDto;
}

export interface AgentsCommunicationPayload {
  interactionId: string;
  organizationId: string;
  requestContent: string;
}

export interface ElizaApi {
  sendAgentsChange(payload: AgentsChangePayload): Promise<void>;
  sendAgentsCommunication(payload: AgentsCommunicationPayload): Promise<void>;
}

@Injectable()
export class ElizaRestApi implements ElizaApi {
  private readonly ELIZA_API_URL = this.config.getOrThrow<string>('ELIZA_API_URL');
  private readonly ELIZA_API_SECRET_KEY = this.config.getOrThrow<string>('ELIZA_API_SECRET_KEY');

  constructor(private readonly config: ConfigService) {}

  public async sendAgentsChange(payload: AgentsChangePayload) {
    await axios.post(`${this.ELIZA_API_URL}/agents/change`, {
      ...payload,
      secretKey: this.ELIZA_API_SECRET_KEY,
    });
  }

  public async sendAgentsCommunication(payload: AgentsCommunicationPayload) {
    await axios.post(`${this.ELIZA_API_URL}/agents/communicate`, {
      ...payload,
      secretKey: this.ELIZA_API_SECRET_KEY,
    });
  }
}
