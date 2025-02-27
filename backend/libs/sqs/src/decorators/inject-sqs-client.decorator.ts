import { Inject } from '@nestjs/common';
import { getSqsClientToken } from '@libs/sqs/utils';

const InjectSqsClientDecorator = (clientName?: string) => {
  return Inject(getSqsClientToken(clientName));
};

export default InjectSqsClientDecorator;
