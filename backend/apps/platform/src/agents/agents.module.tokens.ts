const AgentsModuleTokens = {
  Services: {
    AgentTeamService: Symbol('AgentTeamService'),
    AgentService: Symbol('AgentService'),
    AgentTeamInteractionService: Symbol('AgentTeamInteractionService'),
    InteractionMessageService: Symbol('InteractionMessageService'),
    AgentCommunicationRepliesServiceService: Symbol('AgentCommunicationRepliesServiceService'),
  },
  Repositories: {
    AgentTeamRepository: Symbol('AgentTeamRepository'),
    AgentRepository: Symbol('AgentRepository'),
    AgentTeamInteractionRepository: Symbol('AgentTeamInteractionRepository'),
    InteractionMessageRepository: Symbol('InteractionMessageRepository'),
  },
  EntityMappers: {
    AgentTeamEntityToDtoMapper: Symbol('AgentTeamEntityToDtoMapper'),
    AgentEntityToDtoMapper: Symbol('AgentEntityToDtoMapper'),
    AgentTeamInteractionEntityToDtoMapper: Symbol('AgentTeamInteractionEntityToDtoMapper'),
    InteractionMessageEntityToDtoMapper: Symbol('InteractionMessageEntityToDtoMapper'),
  },
};

export default AgentsModuleTokens;
