import { DynamicModule, Module, FactoryProvider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RESTClient, LCDClient } from '@initia/initia.js';
import { EncryptionModule } from '@libs/encryption';
import { InitiaController } from './controllers';
import { DefaultInitiaService } from './services/initia.service';
import InitiaModuleTokens from './initia.module.tokens';

const InitiaClientOptionsSymbol = Symbol('InitiaClientOptions');

export interface InitiaClientOptions {
  nodeUrl: string;
  chainId: string;
}

export type InitiaModuleOptions = Pick<FactoryProvider<InitiaClientOptions>, 'useFactory' | 'inject'>;

@Module({})
export class InitiaModule {
  public static Tokens = InitiaModuleTokens;

  public static forRootAsync(options: InitiaModuleOptions): DynamicModule {
    return {
      module: InitiaModule,
      imports: [ConfigModule, EncryptionModule],
      controllers: [InitiaController],
      providers: [
        {
          provide: InitiaClientOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: RESTClient,
          useFactory: (options: InitiaClientOptions) => {
            return new LCDClient(options.nodeUrl, {
              chainId: options.chainId,
              gasPrices: '0.15uinit',
              gasAdjustment: '2.0',
            });
          },
          inject: [InitiaClientOptionsSymbol],
        },
        {
          provide: InitiaModuleTokens.Services.InitiaService,
          useClass: DefaultInitiaService,
        },
      ],
      exports: [InitiaModuleTokens.Services.InitiaService],
    };
  }
}
