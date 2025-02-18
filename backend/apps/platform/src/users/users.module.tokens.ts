const UsersModuleTokens = {
  Services: {
    UserService: Symbol('UserService'),
  },
  Repositories: {
    UserRepository: Symbol('UserRepository'),
  },
  EntityMappers: {
    UserEntityToDtoMapper: Symbol('UserEntityToDtoMapper'),
  },
};

export default UsersModuleTokens;
