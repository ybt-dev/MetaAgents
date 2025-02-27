import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { AuthProvider } from '@apps/platform/sessions/enums';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  signature: string;

  @IsNotEmpty()
  @IsIn(Object.values(AuthProvider))
  provider: AuthProvider;

  @IsString()
  pubKey?: string;
}

export class CreateSessionNonceDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
