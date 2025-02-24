import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { MintNFTAction } from "../actions/mintNft.ts";
import { mintNFT } from "../utils/generateMoveContractCode";

// Mock the IAgentRuntime
const mockRuntime = {
  getSetting: vi.fn((key: string) => {
    if (key === "INITIA_MNEMONIC") {
      return "mock_mnemonic";
    }
    if (key === "INITIA_WALLET_ADDRESS") {
      return "mock_wallet_address";
    }
    return null;
  }),
};

// Mock generateMoveContractCode utilities
vi.mock("../utils/generateMoveContractCode", () => ({
  mintNFT: vi.fn().mockResolvedValue({
    success: true,
    transactionId: "mock_transaction_id",
  }),
}));

describe("MintNFT Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("Constructor", () => {
    it("should initialize with runtime", () => {
      const action = new MintNFTAction(mockRuntime as any);
      expect(action).toBeDefined();
    });

    it("should throw if Initia mnemonic is not found", () => {
      const runtimeWithoutMnemonic = {
        getSetting: vi.fn().mockReturnValue(null),
      };

      expect(() => new MintNFTAction(runtimeWithoutMnemonic as any)).toThrow(
        "Initia mnemonic not found"
      );
    });
  });

  describe("mintNFT", () => {
    let action: MintNFTAction;

    beforeEach(() => {
      action = new MintNFTAction(mockRuntime as any);
    });

    it("should successfully mint an NFT", async () => {
      const content = {
        collectionId: "Test Collection",
        name: "Test NFT",
        description: "Test Description",
        imageUrl: "https://example.com/image.png",
        text: "Sample text",
        collectionAddress: "0x11e5db2023e7685b9fcede2f3adf8337547761c0",
      };

      const result = await action.mintNFT(content, 1);

      expect(mintNFT).toHaveBeenCalledWith({
        mnemonic: mockRuntime.getSetting("INITIA_MNEMONIC"),
        collectionName: content.collectionId,
        name: `${content.name} #1`,
        description: content.description,
        imageUrl: content.imageUrl,
        wallet: mockRuntime.getSetting("INITIA_WALLET_ADDRESS"),
      });

      expect(result).toEqual({
        transactionId: "mock_transaction_id",
      });
    });

    it("should throw on invalid content", async () => {
      const invalidContent = {
        name: "Test NFT",
      };

      await expect(action.mintNFT(invalidContent as any, 1)).rejects.toThrow(
        "Invalid content for MINT_NFT action"
      );
    });
  });
});
