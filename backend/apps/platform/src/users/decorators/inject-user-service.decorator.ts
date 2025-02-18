import { Inject } from '@nestjs/common';
import UsersModuleTokens from '@apps/platform/users/users.module.tokens';

const InjectUserService = () => {
  return Inject(UsersModuleTokens.Services.UserService);
};

export default InjectUserService;
