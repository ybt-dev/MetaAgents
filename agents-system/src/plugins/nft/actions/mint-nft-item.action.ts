import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
  composeContext,
  generateObject,
  generateImage,
  ModelClass,
  ServiceType,
} from '@elizaos/core';
import { saveBase64Image, saveHeuristImage } from '@elizaos/plugin-image-generation';
import { AwsS3Service } from '@elizaos/plugin-node';
import AgentSettingsKey from '../../../enums/agent-settings-key.enum.ts';
import { InitiaApi } from '../../../api/initia.api.ts';
import generateNftItemSchema from '../schemas/generate-nft-item.schema.ts';
import { generateNftItemImageTemplate, generateNftItemTemplate } from '../templates/action.templates.ts';

interface NftItemInfo {
  collectionName: string;
  description: string;
  tokenId: string;
  recipient: string;
}

export default class MintNftItemAction implements Action {
  public name = 'MINT_NFT';
  public description = 'Mint an NFT on Initia';

  public similes = ['NFT_MINTING', 'MINT_TOKEN', 'CREATE_NFT', 'MAKE_NFT', 'GENERATE_NFT'];

  public examples = [
    [
      {
        user: '{{agentName}}',
        content: { text: 'Mint an NFT on Initia' },
      },
      {
        user: '{{agentName}}',
        content: {
          text: "Here's your new NFT on Initia.",
          action: 'MINT_NFT',
        },
      },
    ],
  ];

  constructor(private initiaApi: InitiaApi) {}

  public async validate(runtime: IAgentRuntime) {
    return !!runtime.getSetting(AgentSettingsKey.InitiaEncryptedPrivateKey);
  }

  public async handler(
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    options?: Record<string, unknown>,
    callback?: HandlerCallback,
  ) {
    try {
      const currentState = state ? await runtime.updateRecentMessageState(state) : await runtime.composeState(message);

      const result = await this.mintNft(runtime, currentState);

      await callback?.({
        text:
          `NFT minted successfully! 🎉\n` +
          `Transaction ID: ${result.transactionId}\n` +
          `View on Explorer: https://scan.testnet.initia.xyz/initiation-2/tx/${result.transactionId}`,
        attachments: [],
      });

      return true;
    } catch (error) {
      await callback?.({
        text: `Failed to mint NFT: ${error.message}`,
        attachments: [],
      });

      return false;
    }
  }

  public async mintNft(runtime: IAgentRuntime, state: State) {
    const context = composeContext({ state, template: generateNftItemTemplate });

    const { object: content } = (await generateObject({
      runtime,
      context,
      modelClass: ModelClass.LARGE,
      schema: generateNftItemSchema,
    })) as { object: NftItemInfo };

    const metadataUrl = await this.generateNftMetadata(runtime, state, content);

    if (!metadataUrl) {
      throw new Error('Failed to generate NFT metadata.');
    }

    const transactionResult = await this.initiaApi.mintNft({
      collectionName: content.collectionName,
      description: content.description,
      tokenId: content.tokenId,
      uri: metadataUrl,
      recipient: content.recipient,
      encryptedPrivateKey: runtime.getSetting(AgentSettingsKey.InitiaEncryptedPrivateKey),
    });

    return {
      transactionId: transactionResult.transactionId,
    };
  }

  private async generateNftMetadata(runtime: IAgentRuntime, state: State, nftInfo: NftItemInfo) {
    const awsS3Service: AwsS3Service = runtime.getService(ServiceType.AWS_S3);

    const context = composeContext({
      state,
      template: generateNftItemImageTemplate,
    });

    const generationResult = await generateImage(
      {
        prompt: context,
        width: 800,
        height: 800,
      },
      runtime,
    );

    if (generationResult.success && generationResult.data && generationResult.data.length > 0) {
      const [image] = generationResult.data;
      const filename = `nft-${nftInfo.tokenId}`;

      const filepath = image.startsWith('http')
        ? await saveHeuristImage(image, filename)
        : saveBase64Image(image, filename);

      const imagePath = await awsS3Service.uploadFile(filepath, `/${nftInfo.collectionName}/${nftInfo.tokenId}`, false);

      const jsonFilePath = await awsS3Service.uploadJson(
        {
          name: nftInfo.tokenId,
          description: nftInfo.description,
          image: imagePath.url,
          attributes: [], // Add attributes if needed
        },
        'metadata.json',
        `${nftInfo.collectionName}/${nftInfo.tokenId}`,
      );

      return jsonFilePath.success ? jsonFilePath.url : null;
    }

    return null;
  }
}
