import { Inject } from '@nestjs/common';
import UsersModuleTokens from '@apps/platform/users/users.module.tokens';

const InjectUserEntityToDtoMapper = () => {
  return Inject(UsersModuleTokens.EntityMappers.UserEntityToDtoMapper);
};

export default InjectUserEntityToDtoMapper;
