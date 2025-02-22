import {
  createCollection,
  mintNFT,
} from "../utils/generateMoveContractCode.ts";

async function main() {
  try {
    const MNEMONIC = "your mnemonic phrase here";
    const WALLET = "init1ge3s4l73rgrqvszup9uzyqhgxkqke9jjkt9ndg";

    // 1. Create Collection
    console.log("\nCreating Collection...");
    const collectionResult = await createCollection({
      name: "Test Collection",
      description: "Test NFT Collection",
      uri: "https://example.com/collection",
      maxSupply: 100,
      wallet: WALLET,
      mnemonic: MNEMONIC,
    });

    if (!collectionResult.success) {
      throw new Error(`Collection creation failed: ${collectionResult.error}`);
    }
    console.log("Transaction ID:", collectionResult.transactionId);
    console.log("Collection ID:", collectionResult.collectionId);

    // Wait a few seconds for the collection to be created
    console.log("Waiting for collection creation to be confirmed...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 2. Mint NFT
    console.log("\nMinting NFT...");
    const mintResult = await mintNFT(
      {
        collectionName: "Test Collection",
        name: "Test NFT #1",
        description: "My first test NFT",
        imageUrl: "https://example.com/nft1.jpg",
        contentBytes: "1",
        amount: 1,
      },
      MNEMONIC
    );

    if (!mintResult.success) {
      throw new Error(`Minting failed: ${mintResult.error}`);
    }
    console.log("Transaction ID:", mintResult.transactionId);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

// npx tsx eliza-starter/src/plugin/nftPlugin/tests/test-contract.ts
