import { createHash } from 'crypto';
import * as elliptic from 'elliptic';
import { bech32 } from 'bech32';
import { MessageValidatorService } from './message-validator.service';

export class InitiaMessageValidatorService implements MessageValidatorService {
  public async verify(message: string, signature: string, stringPublicKey: string) {
    const decodedSignature = Buffer.from(signature, 'base64');
    const publicKey = new Uint8Array(stringPublicKey.split(',').map(Number));

    const ec = new elliptic.ec('secp256k1');
    const key = ec.keyFromPublic(publicKey, 'hex');

    const msgHash = createHash('sha256').update(message).digest('hex');

    const success = key.verify(msgHash, {
      r: decodedSignature.slice(0, 32).toString('hex'),
      s: decodedSignature.slice(32, 64).toString('hex'),
    });

    const address = this.getBech32Address(stringPublicKey);

    return { success, address };
  }

  private getBech32Address(pubKey: string): string {
    const pubKeyBytes = Buffer.from(pubKey.split(',').map(Number));

    const sha256Hash = createHash('sha256').update(pubKeyBytes).digest();

    const ripemd160Hash = createHash('ripemd160').update(sha256Hash).digest();

    const words = bech32.toWords(ripemd160Hash);

    return bech32.encode('init', words);
  }
}
