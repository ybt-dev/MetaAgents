import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { InjectInitiaService } from '@apps/platform/initia/decorators';
import { SendAmountDto, CreateNftCollectionDto } from '@apps/platform/initia/dto';
import { InitiaService } from '@apps/platform/initia/services';

@Controller('initia')
export class InitiaController {
  constructor(@InjectInitiaService() private readonly initiaService: InitiaService) {}

  @Get('balance')
  public getAddress(@Query('walletAddress') walletAddress: string) {
    return this.initiaService.getWalletBalance(walletAddress);
  }

  @Post('send-amount')
  public sendTx(@Body() body: SendAmountDto) {
    return this.initiaService.sendTx({
      amount: body.amount,
      sender: body.sender,
      recipient: body.recipient,
      encryptedPrivateKey: body.encryptedPrivateKey,
    });
  }

  @Post('create-collection')
  public createNftCollection(@Body() body: CreateNftCollectionDto) {
    return this.initiaService.createNftCollection({
      name: body.name,
      description: body.description,
      uri: body.uri,
      maxSupply: body.maxSupply,
      royalty: body.royalty,
      encryptedPrivateKey: body.encryptedPrivateKey,
    });
  }
}
