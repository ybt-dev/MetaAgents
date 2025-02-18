import { Inject } from '@nestjs/common';
import JwtModuleTokens from '@libs/jwt/jwt.module.tokens';

const InjectJwtService = () => {
  return Inject(JwtModuleTokens.Services.JwtService);
};

export default InjectJwtService;
