import { Inject } from '@nestjs/common';
import EventsModuleTokens from '@libs/events/events.module.tokens';

const InjectEventsService = () => {
  return Inject(EventsModuleTokens.Services.EventsService);
};

export default InjectEventsService;
