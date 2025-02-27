import { Module } from '@nestjs/common';
import { DefaultEncryptionHelper } from './helpers';
import EncryptionModuleTokens from './encryption.module.tokens';

@Module({
  controllers: [],
  imports: [],
  providers: [
    {
      provide: EncryptionModuleTokens.Helpers.EncryptionHelper,
      useClass: DefaultEncryptionHelper,
    },
  ],
  exports: [EncryptionModuleTokens.Helpers.EncryptionHelper],
})
export class EncryptionModule {
  public static Tokens = EncryptionModuleTokens;
}
