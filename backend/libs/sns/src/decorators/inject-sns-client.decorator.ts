import { Inject } from '@nestjs/common';
import { getSnsClientToken } from '@libs/sns/utils';

const InjectSnsClientDecorator = (clientName?: string) => {
  return Inject(getSnsClientToken(clientName));
};

export default InjectSnsClientDecorator;
