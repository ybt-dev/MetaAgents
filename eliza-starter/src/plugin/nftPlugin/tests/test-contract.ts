import {
  generateMoveContract,
  compileMoveContract,
  publishMoveContract,
  createCollection,
  mintNFT,
} from "../utils/generateMoveContractCode.ts";

async function main() {
  try {
    const WALLET = "my-wallet";
    const PASSPHRASE = "";

    // 1. Generate/Get Contract
    console.log("Generating/Getting Contract...");
    const contract = await generateMoveContract({
      packageName: "nft_collection_test_plugin_test_2",
      name: "Test Collection",
      symbol: "TEST",
      description: "Test NFT Collection",
      maxSupply: 100,
    });
    console.log("Contract path:", contract.path);

    // 2. Compile Contract
    console.log("\nCompiling Contract...");
    const compilationResult = await compileMoveContract(contract.packagePath);
    if (!compilationResult.compiled) {
      throw new Error(`Compilation failed: ${compilationResult.error}`);
    }
    console.log("Compilation successful!");

    // 3. Publish Contract
    console.log("\nPublishing Contract...");
    const publishResult = await publishMoveContract(
      contract.packagePath,
      WALLET,
      PASSPHRASE
    );
    if (!publishResult.success) {
      throw new Error(`Publishing failed: ${publishResult.error}`);
    }
    console.log("Package ID:", publishResult.packageId);

    // 4. Create Collection
    console.log("\nCreating Collection...");
    const collectionResult = await createCollection({
      packageId: publishResult.packageId!,
      name: "Test Collection",
      description: "Test NFT Collection",
      uri: "'https//example.com/collection'",
      maxSupply: 100,
      wallet: WALLET,
      passphrase: PASSPHRASE,
    });
    if (!collectionResult.success) {
      throw new Error(`Collection creation failed: ${collectionResult.error}`);
    }
    console.log("Collection ID:", collectionResult.collectionId);
    console.log("Transaction ID:", collectionResult.transactionId);

    // Wait a few seconds for the collection to be created
    console.log("Waiting for collection creation to be confirmed...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 5. Mint NFT
    console.log("\nMinting NFT...");
    const mintResult = await mintNFT(
      publishResult.packageId!,
      {
        collectionName: "Test Collection",
        name: "Test NFT #1",
        description: "My first test NFT",
        imageUrl: "'https//example.com/nft1.jpg'",
        contentBytes: "1",
        amount: 1,
      },
      WALLET,
      PASSPHRASE
    );
    if (!mintResult.success) {
      throw new Error(`Minting failed: ${mintResult.error}`);
    }
    console.log("NFT ID:", mintResult.nftId);
    console.log("Transaction ID:", mintResult.transactionId);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

// npx tsx eliza-starter/src/plugin/nftPlugin/tests/test-contract.ts
