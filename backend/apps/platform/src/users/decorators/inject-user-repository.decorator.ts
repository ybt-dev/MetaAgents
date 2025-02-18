import { Inject } from '@nestjs/common';
import UsersModuleTokens from '@apps/platform/users/users.module.tokens';

const InjectUserRepository = () => {
  return Inject(UsersModuleTokens.Repositories.UserRepository);
};

export default InjectUserRepository;
