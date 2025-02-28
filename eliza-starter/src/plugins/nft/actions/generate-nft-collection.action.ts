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
import generateNftCollectionSchema from '../schemas/generate-nft-collection.schema.ts';
import { generateNftCollectionImageTemplate, generateNftCollectionTemplate } from '../templates/action.templates.ts';

interface CollectionInfo {
  name: string;
  description: string;
  maxSupply: number;
  royaltyPercentage: number;
}

export default class GenerateNftCollectionAction implements Action {
  public name = 'CREATE_NFT_COLLECTION';
  public description = 'Create and deploy an NFT collection on Initia';

  public similes = [
    'COLLECTION_GENERATION',
    'COLLECTION_GEN',
    'CREATE_COLLECTION',
    'MAKE_COLLECTION',
    'GENERATE_COLLECTION',
  ];

  public examples = [
    [
      {
        user: '{{agentName}}',
        content: { text: 'Create a NFT collection' },
      },
      {
        user: '{{agentName}}',
        content: {
          text: "Here's your new NFT collection.",
          action: 'CREATE_NFT_COLLECTION',
        },
      },
    ],
  ];

  private readonly METADATA_IMAGE_WIDTH = 320;
  private readonly METADATA_IMAGE_HEIGHT = 320;

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

      const result = await this.generateCollection(runtime, currentState);

      await callback?.({
        text:
          `Collection created successfully! 🎉\n` +
          `Transaction ID: ${result.transactionId}\n` +
          `Collection ID: ${result.collectionId || 'unknown'}\n` +
          `View on Explorer: https://scan.testnet.initia.xyz/initiation-2/tx/${result.transactionId}`,
        attachments: [],
      });

      return true;
    } catch (error) {
      console.error('Failed to generate collection:', error.message);

      await callback?.({
        text: `Failed to generate collection: ${error.message}`,
        attachments: [],
      });

      return false;
    }
  }

  public async generateCollection(runtime: IAgentRuntime, state: State) {
    const context = composeContext({ state, template: generateNftCollectionTemplate });

    const { object: content } = (await generateObject({
      runtime,
      context,
      modelClass: ModelClass.LARGE,
      schema: generateNftCollectionSchema,
    })) as { object: CollectionInfo };

    // todo add check for format of object

    const metadataUrl = await this.generateCollectionMetadata(runtime, state, content.name);

    if (!metadataUrl) {
      throw new Error('Failed to generate collection metadata.');
    }

    return this.initiaApi.createNftCollection({
      name: content.name,
      description: content.description,
      encryptedPrivateKey: runtime.getSetting(AgentSettingsKey.InitiaEncryptedPrivateKey),
      uri: metadataUrl,
      maxSupply: content.maxSupply,
      royalty: Math.max(0, Math.min(100, content.royaltyPercentage)),
    });
  }

  private async generateCollectionMetadata(runtime: IAgentRuntime, state: State, collectionName: string) {
    const awsS3Service: AwsS3Service = runtime.getService(ServiceType.AWS_S3);

    const context = composeContext({
      state,
      template: generateNftCollectionImageTemplate,
    });

    const generationResult = await generateImage(
      {
        prompt: context,
        width: this.METADATA_IMAGE_WIDTH,
        height: this.METADATA_IMAGE_HEIGHT,
      },
      runtime,
    );

    if (generationResult.success && generationResult.data && generationResult.data.length > 0) {
      const [image] = generationResult.data;
      const filename = `${collectionName}.png`;

      const filepath = image.startsWith('http')
        ? await saveHeuristImage(image, filename)
        : saveBase64Image(image, filename);

      const logoPath = await awsS3Service.uploadFile(filepath, collectionName, false);

      const jsonFilePath = await awsS3Service.uploadJson(
        {
          name: collectionName,
          description: `${collectionName} Collection`,
          image: logoPath.url,
        },
        'metadata.json',
        collectionName,
      );

      if (jsonFilePath.error) {
        throw new Error(`Failed to upload json metadata: ${jsonFilePath.error}`);
      }

      return jsonFilePath.success ? jsonFilePath.url : null;
    }

    return null;
  }
}
