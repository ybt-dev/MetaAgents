import { Module } from '@nestjs/common';
import { InitiaController } from './controllers';
import { DefaultInitiaService } from './services/initia.service';
import InitiaModuleTokens from './initia.module.tokens';

@Module({
  imports: [],
  controllers: [InitiaController],
  providers: [
    {
      provide: InitiaModuleTokens.Services.InitiaService,
      useClass: DefaultInitiaService,
    },
  ],
  exports: [InitiaModuleTokens.Services.InitiaService],
})
export class InitiaModule {
  public static Tokens = InitiaModuleTokens;
}
