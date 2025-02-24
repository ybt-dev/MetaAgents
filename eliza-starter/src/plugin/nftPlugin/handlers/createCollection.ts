import type { AwsS3Service } from "@elizaos/plugin-node";
import {
  composeContext,
  elizaLogger,
  generateImage,
  getEmbeddingZeroVector,
  type IAgentRuntime,
  type Memory,
  ServiceType,
  stringToUuid,
} from "@elizaos/core";
import {
  saveBase64Image,
  saveHeuristImage,
} from "@elizaos/plugin-image-generation";

import { collectionImageTemplate } from "../templates/index.ts";

export async function createCollectionMetadata({
  runtime,
  collectionName,
  fee,
}: {
  runtime: IAgentRuntime;
  collectionName: string;
  fee?: number;
}) {
  const userId = runtime.agentId;
  elizaLogger.log("User ID:", userId);
  const awsS3Service: AwsS3Service = runtime.getService(ServiceType.AWS_S3);
  const agentName = runtime.character.name;
  const roomId = stringToUuid(`nft_generate_room-${agentName}`);

  // Create memory for the message
  const memory: Memory = {
    agentId: userId,
    userId,
    roomId,
    content: {
      text: "",
      source: "nft-generator",
    },
    createdAt: Date.now(),
    embedding: getEmbeddingZeroVector(),
  };
  const state = await runtime.composeState(memory, {
    collectionName,
  });

  const prompt = composeContext({
    state,
    template: collectionImageTemplate,
  });

  const images = await generateImage(
    {
      prompt,
      width: 300,
      height: 300,
    },
    runtime
  );

  if (images.success && images.data && images.data.length > 0) {
    const image = images.data[0];
    const filename = "collection-image";
    const filepath = image.startsWith("http")
      ? await saveHeuristImage(image, filename)
      : saveBase64Image(image, filename);

    const logoPath = await awsS3Service.uploadFile(
      filepath,
      `/${collectionName}`,
      false
    );

    const jsonFilePath = await awsS3Service.uploadJson(
      {
        name: collectionName,
        description: `${collectionName} Collection`,
        image: logoPath.url,
      },
      "metadata.json",
      `${collectionName}`
    );

    return {
      name: collectionName,
      symbol: collectionName.slice(0, 5).toUpperCase(),
      description: `${collectionName} Collection`,
      uri: jsonFilePath.url,
      maxSupply: 1000,
      fee: fee || 0,
    };
  }

  return null;
}

export const createCollection = async (
  runtime: IAgentRuntime,
  collectionName: string,
  fee?: number
) => {
  try {
    // Ensure we're using testnet
    if (runtime.getSetting("INITIA_NETWORK") !== "testnet") {
      throw new Error(
        "Collection creation is only supported on Initia testnet"
      );
    }

    const collectionInfo = await createCollectionMetadata({
      runtime,
      collectionName,
      fee,
    });

    if (!collectionInfo) return null;

    const { createCollection } = await import(
      "../utils/generateMoveContractCode"
    );

    const createCollectionResult = await createCollection({
      name: collectionInfo.name,
      description: collectionInfo.description,
      uri: collectionInfo.uri,
      maxSupply: collectionInfo.maxSupply,
      royalty: collectionInfo.fee || 0,
      mnemonic: runtime.getSetting("INITIA_MNEMONIC"),
      wallet: runtime.getSetting("INITIA_WALLET"),
    });

    if (!createCollectionResult.success) {
      throw new Error(
        `Failed to create collection: ${createCollectionResult.error}`
      );
    }

    return {
      network: "initia:initiation-2",
      collectionId: createCollectionResult.collectionId,
      transactionId: createCollectionResult.transactionId,
      link: `https://scan.testnet.initia.xyz/initiation-2/tx/${createCollectionResult.transactionId}`,
      collectionInfo,
    };
  } catch (error) {
    elizaLogger.error("Error creating collection:", error);
    throw error;
  }
};
