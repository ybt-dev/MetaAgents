import type { IAgentRuntime } from "@elizaos/core";

const BACKEND_URL = process.env.BACKEND_URL;

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

    try {
      const nftInfo = await fetch(`${BACKEND_URL}/nftInfo`, {
        method: 'Post',
        body: JSON.stringify({
          nftId: nftId,
          moduleOwner: "0x11e5db2023e7685b9fcede2f3adf8337547761c0"
        })
      })

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
