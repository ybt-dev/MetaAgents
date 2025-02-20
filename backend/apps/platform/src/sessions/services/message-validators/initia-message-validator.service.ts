import { MessageValidatorService } from './message-validator.service';
import * as elliptic from 'elliptic';
import crypto from 'crypto';
import { bech32 } from 'bech32';

export class InitiaMessageValidatorService implements MessageValidatorService {
  public async verify(message: string, signature: string, pubKey: string) {
    const decodedSignature = Buffer.from(signature, 'base64');
    const _pubKey = new Uint8Array(pubKey.split(',').map(Number));

    const ec = new elliptic.ec('secp256k1');
    const key = ec.keyFromPublic(_pubKey, 'hex');

    const signatureObj = {
      r: decodedSignature.slice(0, 32).toString('hex'),
      s: decodedSignature.slice(32, 64).toString('hex'),
    };

    const msgHash = await crypto.createHash('sha256').update(message).digest();

    const success = await key.verify(msgHash, signatureObj);

    const address = this.getBech32Address(pubKey);
    return {
      success: success,
      address: address,
    };
  }

  private getBech32Address(pubKey: string): string {
    const pubKeyBytes = Buffer.from(pubKey.split(',').map(Number));

    const sha256Hash = crypto.createHash('sha256').update(pubKeyBytes).digest();

    const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();

    const words = bech32.toWords(ripemd160Hash);
    return bech32.encode('init', words);
  }
}
