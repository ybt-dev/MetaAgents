import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InitiaController } from './controllers';

@Module({
  imports: [ConfigModule],
  controllers: [InitiaController],
  providers: [],
  exports: [],
})
export class SessionsModule {}
