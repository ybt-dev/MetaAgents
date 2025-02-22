import { LCDClient, Wallet, MnemonicKey, MsgExecute } from "@initia/initia.js";

interface MintNFTParams {
  collectionName: string;
  name: string;
  description: string;
  imageUrl: string;
  contentBytes: string;
  amount: number;
}

export async function mintNFT(
  params: MintNFTParams,
  mnemonic: string
): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
}> {
  try {
    const lcd = new LCDClient("https://lcd.initiation-2.initia.xyz", {
      chainId: "initiation-2",
      gasPrices: "0.15uinit",
      gasAdjustment: "2.0",
    });

    const key = new MnemonicKey({
      mnemonic: mnemonic,
    });

    const wallet = new Wallet(lcd, key);

    const msg = new MsgExecute(
      key.accAddress,
      "0x11e5db2023e7685b9fcede2f3adf8337547761c0",
      "metaAgents_nft_module",
      "mint_nft",
      undefined,
      [
        btoa(params.collectionName),
        btoa(params.name),
        btoa(params.description),
        btoa(params.imageUrl),
        btoa(wallet.key.accAddress),
      ]
    );

    const signedTx = await wallet.createAndSignTx({
      msgs: [msg],
    });

    const result = await lcd.tx.broadcast(signedTx);

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

interface CreateCollectionParams {
  name: string;
  description: string;
  uri: string;
  maxSupply: number;
  wallet: string;
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
    const lcd = new LCDClient("https://lcd.initiation-2.initia.xyz", {
      chainId: "initiation-2",
      gasPrices: "0.15uinit",
      gasAdjustment: "2.0",
    });

    const key = new MnemonicKey({
      mnemonic: params.mnemonic,
    });

    const wallet = new Wallet(lcd, key);

    // Convert parameters to base64 encoded strings
    const nameBytes = btoa(params.name);
    const descriptionBytes = btoa(params.description);
    const uriBytes = btoa(params.uri);
    const maxSupplyBytes = btoa(params.maxSupply.toString());
    const royaltyBytes = btoa("5"); // 5% royalty

    const msg = new MsgExecute(
      key.accAddress,
      "0x11e5db2023e7685b9fcede2f3adf8337547761c0",
      "metaAgents_nft_module",
      "create_collection",
      undefined,
      [nameBytes, descriptionBytes, uriBytes, maxSupplyBytes, royaltyBytes]
    );

    const signedTx = await wallet.createAndSignTx({
      msgs: [msg],
    });

    const result = await lcd.tx.broadcast(signedTx);

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
