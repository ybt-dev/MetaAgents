import { Controller, Inject, Post } from '@nestjs/common';
import { InitiaService } from '@apps/platform/initia/services';
import InitiaModuleTokens from '../initia.module.tokens';

@Controller('initia')
export class InitiaController {
  constructor(@Inject(InitiaModuleTokens.Services.InitiaService) private readonly initiaService: InitiaService) {}

  @Post('address')
  getAddress(mnemonic: string, privateKey?: string): string {
    return this.initiaService.getAddress(mnemonic, privateKey);
  }

  @Post('balance')
  getBalance(address: string, mnemonic: string, privateKey?: string) {
    return this.initiaService.getBalance(address, mnemonic, privateKey);
  }

  @Post('send')
  sendTx(sender: string, recipient: string, amount: string, mnemonic: string, privateKey?: string) {
    return this.initiaService.sendTx(sender, recipient, amount, mnemonic, privateKey);
  }

  @Post('nftInfo')
  getNftInfo(nftId: string, moduleOwner: string) {
    return this.initiaService.getNftInfo(nftId, moduleOwner);
  }

  @Post('mintNft')
  mintNft(
    mnemonic: string,
    destinationAddress: string,
    collectionName: string,
    name: string,
    description: string,
    imageUrl: string,
    walletAddress: string,
  ) {
    return this.initiaService.mintNft(
      mnemonic,
      destinationAddress,
      collectionName,
      name,
      description,
      imageUrl,
      walletAddress,
    );
  }

  @Post('create_collection')
  createCollection(
    mnemonic: string,
    destinationAddress: string,
    name: string,
    description: string,
    uri: string,
    maxSupply: number,
    royalty: number,
  ) {
    return this.initiaService.createCollection(
      mnemonic,
      destinationAddress,
      name,
      description,
      uri,
      maxSupply,
      royalty,
    );
  }
}
