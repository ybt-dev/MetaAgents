import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SendAmountDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  encryptedPrivateKey: string;
}

export class CreateNftCollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  uri: string;

  @IsNumber()
  @IsNotEmpty()
  maxSupply: number;

  @IsNumber()
  @IsNotEmpty()
  royalty: number;

  @IsString()
  @IsNotEmpty()
  encryptedPrivateKey: string;
}

export class MintNftDto {
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @IsString()
  @IsNotEmpty()
  uri: string;

  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  encryptedPrivateKey: string;
}
