import { createContext, useContext } from 'react';
import { SessionsApi } from '@/api/SessionsApi';
import { AgentTeamsApi } from '@/api/AgentTeamsApi';
import { AgentsApi } from '@/api/AgentsApi';
import { AgentTeamInteractionsApi } from '@/api/AgentTeamInteractionsApi';
import { AgentMessagesApi } from '@/api/AgentMessagesApi';

export interface ApiProviderValue {
  sessionsApi: SessionsApi;
  agentTeamsApi: AgentTeamsApi;
  agentTeamInteractionsApi: AgentTeamInteractionsApi;
  agentMessagesApi: AgentMessagesApi;
  agentApi: AgentsApi;
}

export type Services = ApiProviderValue[keyof ApiProviderValue];

const ApiContext = createContext<ApiProviderValue>({} as ApiProviderValue);

const createServiceHook = <ServiceType extends Services>(serviceName: keyof ApiProviderValue) => {
  return () => {
    const services = useContext(ApiContext);

    return services[serviceName] as ServiceType;
  };
};

export const useSessionsApi = createServiceHook<SessionsApi>('sessionsApi');
export const useAgentTeamsApi = createServiceHook<AgentTeamsApi>('agentTeamsApi');
export const useAgentsApi = createServiceHook<AgentsApi>('agentApi');
export const useAgentTeamInteractionsApi = createServiceHook<AgentTeamInteractionsApi>('agentTeamInteractionsApi');
export const useAgentMessagesApi = createServiceHook<AgentMessagesApi>('agentMessagesApi');

export const ApiProvider = ApiContext.Provider;
