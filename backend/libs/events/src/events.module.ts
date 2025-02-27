import { Module } from '@nestjs/common';
import { PublishersModule } from '@libs/publishers';
import { TransactionsModule } from '@libs/transactions';
import { DefaultEventsService } from './services';
import EventsModuleTokens from './events.module.tokens';

@Module({
  imports: [PublishersModule.register('events'), TransactionsModule],
  controllers: [],
  providers: [
    {
      provide: EventsModuleTokens.Services.EventsService,
      useClass: DefaultEventsService,
    },
  ],
  exports: [EventsModuleTokens.Services.EventsService],
})
export class EventsModule {}
