import { MintNFTParams, CreateCollectionParams } from "../types";

const BACKEND_URL = process.env.BACKEND_URL;

export async function mintNFT(params: MintNFTParams): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
}> {
  try {
    const result = await fetch(`${BACKEND_URL}/mintNft`, {
      method: 'POST',
      body: JSON.stringify({
        mnemonic: params.mnemonic,
        destinationAddress: '0x11e5db2023e7685b9fcede2f3adf8337547761c0',
        collectionName: params.collectionName,
        description: params.description,
        name: params.name,
        imageUrl: params.imageUrl,
        walletAddress: params.wallet
      })
    }).then(data => data.json()) as any;

    if (!result.txhash) {
      return {
        success: false,
        error: "Could not find transaction ID in output",
      };
    }

    return {
      success: true,
      transactionId: result.txhash,
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createCollection(
  params: CreateCollectionParams & { mnemonic: string }
): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
  collectionId?: string;
}> {
  try {
    const result = await fetch(`${BACKEND_URL}/mintNft`, {
      method: 'POST',
      body: JSON.stringify({
        mnemonic: params.mnemonic,
        destinationAddress: '0x11e5db2023e7685b9fcede2f3adf8337547761c0',
        name: params.name,
        description: params.description,
        uru: params.uri,
        maxSupply: params.maxSupply,
        royalty: params.royalty
      })
    }).then(data => data.json()) as any;

    if (!result.txhash) {
      return {
        success: false,
        error: "Could not find transaction ID in output",
      };
    }

    // Parse collection_id from events if available
    const collectionId = result.logs?.[0]?.events
      ?.find((e) => e.type === "wasm")
      ?.attributes?.find((a) => a.key === "collection_id")?.value;

    return {
      success: true,
      transactionId: result.txhash,
      collectionId: collectionId,
    };
  } catch (error) {
    console.error("Error creating collection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
