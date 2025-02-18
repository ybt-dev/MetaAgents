import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DefaultJwtService } from './services';
import JwtModuleTokens from './jwt.module.tokens';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    {
      provide: JwtModuleTokens.Services.JwtService,
      useClass: DefaultJwtService,
    },
  ],
  exports: [JwtModuleTokens.Services.JwtService],
})
export class JwtModule {}
