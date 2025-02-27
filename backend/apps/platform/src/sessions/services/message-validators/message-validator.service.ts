export interface MessageVerificationResult {
  success: boolean;
  address: string;
  nonce?: string;
}

export interface MessageValidatorService {
  verify(message: string, signature: string, pubKey?: string): Promise<MessageVerificationResult>;
}
