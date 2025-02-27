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
import { mintNFTTemplate } from "../templates/index.ts";
import { type MintNFTContent, MintNFTSchema } from "../types/index.ts";
import { mintNFT } from "../utils/generateMoveContractCode.ts";

function isMintNFTContent(content: any): content is MintNFTContent {
  return (
    typeof content.collectionId === "string" &&
    typeof content.name === "string" &&
    typeof content.description === "string"
  );
}

export class MintNFTAction {
  constructor(private runtime: IAgentRuntime) {
    if (!runtime.getSetting("INITIA_MNEMONIC")) {
      throw new Error("Initia mnemonic not found");
    }
  }

  async mintNFT(content: MintNFTContent, tokenId: number) {
    if (!isMintNFTContent(content)) {
      throw new Error("Invalid content for MINT_NFT action");
    }

    // Mint NFT using the Move contract
    const result = await mintNFT({
      mnemonic: this.runtime.getSetting("INITIA_MNEMONIC"),
      collectionName: content.collectionId as string,
      name: `${content.name || "NFT"} #${tokenId}`,
      description: content.description as string,
      imageUrl: content.imageUrl as string,
      wallet: this.runtime.getSetting("INITIA_WALLET_ADDRESS"),
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to mint NFT");
    }

    return {
      transactionId: result.transactionId,
    };
  }
}

const mintNFTAction: Action = {
  name: "MINT_NFT",
  similes: [
    "NFT_MINTING",
    "NFT_CREATION",
    "CREATE_NFT",
    "GENERATE_NFT",
    "MINT_TOKEN",
    "CREATE_TOKEN",
    "MAKE_NFT",
    "TOKEN_GENERATION",
  ],
  description: "Mint NFTs for the collection on Initia",
  validate: async (runtime: IAgentRuntime, _message: Memory) => {
    // Ensure we have the required Initia mnemonic
    return !!runtime.getSetting("INITIA_MNEMONIC");
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    callback: HandlerCallback
  ) => {
    try {
      // Ensure we're on testnet
      if (runtime.getSetting("INITIA_NETWORK") !== "testnet") {
        throw new Error("NFT minting is only supported on Initia testnet");
      }

      elizaLogger.log("Composing state for message:", message);

      let currentState: State;
      if (!state) {
        currentState = (await runtime.composeState(message)) as State;
      } else {
        currentState = await runtime.updateRecentMessageState(state);
      }

      const context = composeContext({
        state: currentState,
        template: mintNFTTemplate,
      });

      const res = await generateObject({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
        schema: MintNFTSchema,
      });

      const content = res.object as MintNFTContent;
      elizaLogger.log("Generate Object:", content);

      const action = new MintNFTAction(runtime);
      const tokenId = Math.floor(Math.random() * 1000000);
      const result = await action.mintNFT(content, tokenId);

      if (callback) {
        callback({
          text: `NFT minted successfully! 🎉\nTransaction ID: ${result.transactionId}\nView on Explorer: https://scan.testnet.initia.xyz/initiation-2/tx/${result.transactionId}`,
          attachments: [],
        });
      }

      return true;
    } catch (e: unknown) {
      elizaLogger.error("Error minting NFT:", e);
      throw e;
    }
  },
  examples: [
    [
      {
        user: "{{agentName}}",
        content: {
          text: "mint nft for collection: 0x1234... on Initia",
        },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "I've minted a new NFT in your specified collection on Initia.",
          action: "MINT_NFT",
        },
      },
    ],
  ],
} as Action;

export default mintNFTAction;
