import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { NFTCollectionAction } from "../actions/nftCollectionGeneration";
import { createCollection } from "../utils/generateMoveContractCode";
import { generateObject } from "@elizaos/core";

// Mock the IAgentRuntime
const mockRuntime = {
  getSetting: vi.fn((key: string) => {
    if (key === "INITIA_MNEMONIC") {
      return "mock_mnemonic";
    }
    if (key === "INITIA_WALLET_ADDRESS") {
      return "mock_wallet_address";
    }
    if (key === "INITIA_NETWORK") {
      return "testnet";
    }
    return null;
  }),
};

// Mock createCollection utility
vi.mock("../utils/generateMoveContractCode", () => ({
  createCollection: vi.fn().mockResolvedValue({
    success: true,
    transactionId: "mock_transaction_id",
    collectionId: "mock_collection_id",
  }),
}));

// Add mock for generateObject
vi.mock("@elizaos/core", () => ({
  generateObject: vi.fn().mockResolvedValue({
    object: {
      maxSupply: 1000,
      royaltyPercentage: 5,
      uri: "https://example.com",
    },
  }),
  ModelClass: { LARGE: "large" },
}));

describe("NFTCollection Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("Constructor", () => {
    it("should initialize with runtime", () => {
      const action = new NFTCollectionAction(mockRuntime as any);
      expect(action).toBeDefined();
    });

    it("should throw if Initia mnemonic is not found", () => {
      const runtimeWithoutMnemonic = {
        getSetting: vi.fn().mockReturnValue(null),
      };

      expect(
        () => new NFTCollectionAction(runtimeWithoutMnemonic as any)
      ).toThrow("Initia mnemonic not found");
    });
  });

  describe("generateCollection", () => {
    let action: NFTCollectionAction;

    beforeEach(() => {
      action = new NFTCollectionAction(mockRuntime as any);
    });

    it("should successfully generate a collection", async () => {
      const result = await action.generateCollection(
        "Test Collection",
        "Test Description"
      );

      expect(result).toEqual({
        transactionId: "mock_transaction_id",
        collectionId: "mock_collection_id",
      });
    });

    it("should handle collection creation failure", async () => {
      vi.mocked(createCollection).mockResolvedValueOnce({
        success: false,
        error: "Creation failed",
      });

      await expect(
        action.generateCollection("Test Collection", "Test Description")
      ).rejects.toThrow("Collection creation failed: Creation failed");
    });
  });
});
