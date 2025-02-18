const AgentsModuleTokens = {
  Api: {
    ElizaApi: Symbol('ElizaApi'),
  },
  Services: {
    AgentTeamService: Symbol('AgentTeamService'),
    AgentService: Symbol('AgentService'),
    AgentTeamInteractionService: Symbol('AgentTeamInteractionService'),
    AgentMessageService: Symbol('AgentMessageService'),
  },
  Repositories: {
    AgentTeamRepository: Symbol('AgentTeamRepository'),
    AgentRepository: Symbol('AgentRepository'),
    AgentTeamInteractionRepository: Symbol('AgentTeamInteractionRepository'),
    AgentMessageRepository: Symbol('AgentMessageRepository'),
  },
  EntityMappers: {
    AgentTeamEntityToDtoMapper: Symbol('AgentTeamEntityToDtoMapper'),
    AgentEntityToDtoMapper: Symbol('AgentEntityToDtoMapper'),
    AgentTeamInteractionEntityToDtoMapper: Symbol('AgentTeamInteractionEntityToDtoMapper'),
    AgentMessageEntityToDtoMapper: Symbol('AgentMessageEntityToDtoMapper'),
  },
};

export default AgentsModuleTokens;
