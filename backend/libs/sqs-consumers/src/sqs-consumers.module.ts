import { DynamicModule, InjectionToken, Module, ModuleMetadata, OptionalFactoryDependency } from '@nestjs/common';
import { ConsumersModule } from '@libs/consumers';
import { SqsModule } from '@libs/sqs';
import { NestProviderValueFactory } from '@libs/types';
import { SqsConsumersService } from './services';
import { ConsumersConfig } from './types';
import SqsConsumersModuleTokens from './sqs-consumers.module.tokens';

export interface RootAsyncSqsConsumersModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: NestProviderValueFactory<ConsumersConfig | Promise<ConsumersConfig>>;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
}

@Module({})
export class SqsConsumersModule {
  public static Tokens = SqsConsumersModuleTokens;

  public static forRootAsync(options: RootAsyncSqsConsumersModuleOptions): DynamicModule {
    return {
      module: SqsConsumersModule,
      imports: [SqsModule.register(), ConsumersModule, ...options.imports],
      providers: [
        {
          provide: SqsConsumersModuleTokens.ConsumersConfig,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: SqsConsumersService,
          useClass: SqsConsumersService,
        },
      ],
    };
  }
}
