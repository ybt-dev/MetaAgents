import { Inject } from '@nestjs/common';
import EncryptionModuleTokens from '@libs/encryption/encryption.module.tokens';

const InjectEncryptionHelper = () => {
  return Inject(EncryptionModuleTokens.Helpers.EncryptionHelper);
};

export default InjectEncryptionHelper;
