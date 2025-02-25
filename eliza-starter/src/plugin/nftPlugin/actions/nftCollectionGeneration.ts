import {
  type Action,
  composeContext,
  elizaLogger,
  generateObject,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelClass,
  type State,
} from "@elizaos/core";
import { CreateCollectionSchema } from "../types/index.ts";
import { createCollectionTemplate } from "../templates/index.ts";
import * as initia from "@initia/initia.js";
import { z } from "zod";
import { createCollection } from "../utils/generateMoveContractCode.ts";

const { LCDClient } = initia;

export class NFTCollectionAction {
  private lcd: InstanceType<typeof LCDClient>;

  constructor(private runtime: IAgentRuntime) {
    if (!runtime.getSetting("INITIA_MNEMONIC")) {
      throw new Error("Initia mnemonic not found");
    }
    // Initialize Initia client with testnet
    this.lcd = new LCDClient("https://lcd.initiation-2.initia.xyz", {
      chainId: "initiation-2",
      gasPrices: "0.15uinit",
      gasAdjustment: "2.0",
    });
  }

  async generateCollection(name: string, description: string) {
    const content = await generateObject({
      runtime: this.runtime,
      context: JSON.stringify({ name, description }),
      modelClass: ModelClass.LARGE,
      schema: z.object({
        maxSupply: z
          .number()
          .min(1)
          .max(10000)
          .describe(
            "Maximum number of NFTs that can be minted in this collection (1-10000)"
          ),
        royaltyPercentage: z
          .number()
          .min(0)
          .max(10)
          .describe("Royalty percentage for secondary sales (0-10)"),
        uri: z
          .string()
          .default("")
          .describe("Optional metadata URI for the collection"),
      }),
    });

    const { object: params } = content as {
      object: {
        maxSupply: number;
        royaltyPercentage: number;
        uri: string;
      };
    };
    const royaltyBasisPoints = Math.floor(params.royaltyPercentage * 100);

    // Create collection using the contract
    const createCollectionResult = await createCollection({
      mnemonic: this.runtime.getSetting("INITIA_MNEMONIC"),
      name: name,
      description: description,
      uri: params.uri,
      maxSupply: params.maxSupply,
      royalty: royaltyBasisPoints,
      wallet: this.runtime.getSetting("INITIA_WALLET_ADDRESS"),
    });

    if (!createCollectionResult.success) {
      throw new Error(
        `Collection creation failed: ${createCollectionResult.error}`
      );
    }

    return {
      transactionId: createCollectionResult.transactionId,
      collectionId: createCollectionResult.collectionId,
    };
  }
}

const nftCollectionGeneration: Action = {
  name: "GENERATE_COLLECTION",
  similes: [
    "COLLECTION_GENERATION",
    "COLLECTION_GEN",
    "CREATE_COLLECTION",
    "MAKE_COLLECTION",
    "GENERATE_COLLECTION",
  ],
  description: "Generate an NFT collection on Initia",
  validate: async (runtime: IAgentRuntime, _message: Memory) => {
    // Ensure we have the required Initia mnemonic
    return !!runtime.getSetting("INITIA_MNEMONIC");
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: { [key: string]: unknown },
    callback: HandlerCallback
  ) => {
    try {
      // Ensure we're on testnet
      if (runtime.getSetting("INITIA_NETWORK") !== "testnet") {
        throw new Error(
          "Collection generation is only supported on Initia testnet"
        );
      }

      elizaLogger.log("Composing state for message:", message);
      const state = await runtime.composeState(message);

      // Compose collection context
      const context = composeContext({
        state,
        template: createCollectionTemplate,
      });

      const res = await generateObject({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
        schema: CreateCollectionSchema,
      });

      const content = res.object as {
        name: string;
        description: string;
      };

      const action = new NFTCollectionAction(runtime);
      const result = await action.generateCollection(
        content.name,
        content.description
      );

      if (callback) {
        callback({
          text:
            `Collection created successfully! 🎉\n` +
            `Transaction ID: ${result.transactionId}\n` +
            `Collection ID: ${result.collectionId}\n` +
            `View on Explorer: https://scan.testnet.initia.xyz/initiation-2/tx/${result.transactionId}`,
          attachments: [],
        });
      }

      return [];
    } catch (e: any) {
      elizaLogger.error("Error generating collection:", e);
      throw e;
    }
  },
  examples: [
    [
      {
        user: "{{agentName}}",
        content: { text: "Generate a collection on Initia" },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's your new NFT collection on Initia.",
          action: "GENERATE_COLLECTION",
        },
      },
    ],
  ],
} as Action;

export default nftCollectionGeneration;
