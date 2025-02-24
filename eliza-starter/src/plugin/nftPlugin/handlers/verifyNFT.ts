import type { IAgentRuntime } from "@elizaos/core";
import { LCDClient } from "@initia/initia.js";

export async function verifyNFT({
  runtime,
  collectionId,
  nftId,
}: {
  runtime: IAgentRuntime;
  collectionId: string;
  nftId: string;
}) {
  try {
    // Ensure we're on testnet
    if (runtime.getSetting("INITIA_NETWORK") !== "testnet") {
      throw new Error("NFT verification is only supported on Initia testnet");
    }

    const lcd = new LCDClient("https://lcd.testnet.initia.xyz", {
      chainId: "initiation-2",
      gasPrices: "0.15uinit",
      gasAdjustment: "2.0",
    });

    // Get NFT object information using Move view function
    try {
      const nftInfo = await lcd.move.viewJSON(
        "0x11e5db2023e7685b9fcede2f3adf8337547761c0", // module owner address (from generateMoveContractCode.ts)
        "metaAgents_nft_module", // module name
        "get_nft_info", // function name
        [], // type arguments
        [nftId] // function arguments
      );

      if (!nftInfo) {
        return {
          success: false,
          error: "NFT not found",
          verified: false,
        };
      }

      // Use the response directly as it's already parsed
      const nftData = nftInfo;

      return {
        success: true,
        owner: (nftData as any).owner,
        collectionId: collectionId,
        nftData: {
          name: (nftData as any).name,
          description: (nftData as any).description,
          url: (nftData as any).url,
        },
        verified: true,
      };
    } catch (moveError) {
      return {
        success: false,
        error: "Failed to fetch NFT data from contract",
        verified: false,
      };
    }
  } catch (error) {
    console.error("Error verifying NFT:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify NFT",
      verified: false,
    };
  }
}
