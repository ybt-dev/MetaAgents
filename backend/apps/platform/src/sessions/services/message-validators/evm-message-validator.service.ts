import { ethers } from 'ethers';
import { MessageValidatorService } from './message-validator.service';
import { bech32 } from 'bech32';

export class EvmMessageValidatorService implements MessageValidatorService {
  public async verify(message: string, signature: string, stringPublicKey?: string) {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      const messageAddress = message.split(' ')[0];

      // Convert the recovered EVM address to Initia format
      const initiaAddress = this.convertEvmToInitiaAddress(recoveredAddress);

      const success = initiaAddress === messageAddress;

      return {
        success,
        address: recoveredAddress,
        nonce: '',
      };
    } catch (error) {
      console.error('EVM verification error:', error);
      return {
        success: false,
        address: '',
        nonce: '',
      };
    }
  }

  private convertEvmToInitiaAddress(evmAddress: string): string {
    try {
      const addressBytes = Buffer.from(evmAddress.replace('0x', ''), 'hex');

      const words = bech32.toWords(addressBytes);

      const initiaAddress = bech32.encode('init', words);

      return initiaAddress;
    } catch (error) {
      console.error('Error converting EVM address to Initia format:', error);
      return '';
    }
  }
}
