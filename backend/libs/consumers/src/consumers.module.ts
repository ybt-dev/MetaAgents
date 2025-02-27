import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { IdempotencyModule } from '@libs/idempotency';
import { DefaultConsumersRegistry } from './consumers.registry';
import ConsumersModuleTokens from './consumers.module.tokens';

@Module({
  imports: [IdempotencyModule, DiscoveryModule],
  providers: [
    {
      provide: ConsumersModuleTokens.ConsumersRegistry,
      useClass: DefaultConsumersRegistry,
    },
  ],
  exports: [ConsumersModuleTokens.ConsumersRegistry],
})
export class ConsumersModule {
  public static Tokens = ConsumersModuleTokens;
}
