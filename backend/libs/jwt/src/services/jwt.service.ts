import * as jsonwebtoken from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyObject } from '@libs/types';

export interface SignOptions {
  /**
   * Expiration time of the token in seconds
   */
  expiresIn?: number;
}

export interface JwtService {
  sign<Payload>(payload: Payload, options?: SignOptions): Promise<string>;
  verify<Payload>(token: string): Promise<Payload | null>;
}

@Injectable()
export class DefaultJwtService implements JwtService {
  private readonly logger = new Logger(DefaultJwtService.name);

  private readonly JWT_SECRET = this.configService.getOrThrow('JWT_SECRET');

  constructor(private configService: ConfigService) {}

  public sign<Payload extends AnyObject>(payload: Payload, options?: SignOptions) {
    return new Promise<string>((resolve, reject) => {
      jsonwebtoken.sign(payload, this.JWT_SECRET, options, (error, token) => {
        if (error || !token) {
          return reject(error);
        }

        return resolve(token);
      });
    });
  }

  public verify<Payload>(token: string) {
    return new Promise<Payload | null>((resolve) => {
      jsonwebtoken.verify(token, this.JWT_SECRET, (error, decoded) => {
        if (error || !decoded) {
          this.logger.warn(`Failed to decode token: ${error}`);

          return resolve(null);
        }

        return resolve(decoded as Payload);
      });
    });
  }
}
