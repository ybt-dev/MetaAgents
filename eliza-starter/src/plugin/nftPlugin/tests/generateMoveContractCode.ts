import { describe, it } from "vitest";
import { createCollection, mintNFT } from "../utils/generateMoveContractCode";

// Increase timeout to 30 seconds for blockchain operations
const TEST_TIMEOUT = 30000;

describe("NFT Contract Functions Demo", () => {
  const WALLET_ADDRESS = "init1yd8syn5tkyexn8sjnr2lg7wh9hlqe3suv5md4q";
  const MNEMONIC =
    "access tail move oak since off outdoor ticket donkey fantasy guitar beach rent fish hand effort rose use uniform magic junk stomach armed concert";

  describe("createCollection", () => {
    it("should create a collection and show output", async () => {
      const params = {
        name: "Test Collection (test pass check)",
        description: "A test collection of NFTs",
        uri: "https://test-collection.com",
        maxSupply: 1000,
        royalty: 5,
        wallet: WALLET_ADDRESS,
        mnemonic: MNEMONIC,
      };

      const result = await createCollection(params);
      console.log("Create Collection Result:", JSON.stringify(result, null, 2));
    });
  });

  describe("mintNFT", () => {
    it(
      "should mint an NFT and show output",
      async () => {
        const params = {
          collectionName: "Test Collection (test pass check)",
          name: "Test NFT #1",
          description: "A test NFT",
          imageUrl: "https://test-nft.com/image.png",
          wallet: WALLET_ADDRESS,
          mnemonic: MNEMONIC,
        };

        const result = await mintNFT(params);
        console.log("Mint NFT Result:", JSON.stringify(result, null, 2));
      },
      TEST_TIMEOUT
    );
  });
});
