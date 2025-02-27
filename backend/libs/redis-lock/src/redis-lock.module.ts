import { Module } from '@nestjs/common';
import { RedisLockService } from './services';

@Module({
  providers: [
    {
      provide: RedisLockService,
      useClass: RedisLockService,
    },
  ],
  exports: [RedisLockService],
})
export class RedisLockModule {}
