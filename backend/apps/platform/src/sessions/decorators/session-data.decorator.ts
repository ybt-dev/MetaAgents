import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Session = createParamDecorator((data: undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return {
    userId: request.session.get('userId'),
    organizationId: request.session.get('organizationId'),
  };
});

export default Session;
