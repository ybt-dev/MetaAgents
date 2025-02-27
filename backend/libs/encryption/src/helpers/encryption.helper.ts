import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Buffer } from 'node:buffer';

export interface EncryptionHelper {
  encrypt(content: string, encryptionSecret: string): string;
  decrypt(hash: string, encryptionSecret: string): string;
}

@Injectable()
export class DefaultEncryptionHelper implements EncryptionHelper {
  protected CIPHERIV_ALGORITHM = 'aes-256-cbc';
  protected HASH_ALGORITHM = 'sha256';
  protected STRING_ENCODING = 'base64' as const;
  protected INITIAL_VECTOR_LENGTH = 16;

  public encrypt(content: string, encryptionSecret: string) {
    const initialVector = crypto.randomBytes(this.INITIAL_VECTOR_LENGTH);
    const cipherKey = this.getCipherKey(encryptionSecret);

    const cipher = crypto.createCipheriv(this.CIPHERIV_ALGORITHM, cipherKey, initialVector);

    return Buffer.concat([initialVector, cipher.update(content), cipher.final()]).toString(this.STRING_ENCODING);
  }

  public decrypt(hash: string, encryptionSecret: string) {
    const hashBuffer = Buffer.from(hash, this.STRING_ENCODING);

    const initialVector = hashBuffer.slice(0, this.INITIAL_VECTOR_LENGTH);
    const content = hashBuffer.slice(this.INITIAL_VECTOR_LENGTH);

    const cipherKey = this.getCipherKey(encryptionSecret);

    const decipher = crypto.createDecipheriv(this.CIPHERIV_ALGORITHM, cipherKey, initialVector);

    const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);

    return decrypted.toString();
  }

  private getCipherKey(encryptionSecret: string) {
    return crypto.createHash(this.HASH_ALGORITHM).update(encryptionSecret).digest();
  }
}
