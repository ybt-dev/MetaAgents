import { describe, expect, it, vi } from "vitest";
import { WalletProvider } from "../providers/wallet";
import { IAgentRuntime } from "@elizaos/core";

describe("WalletProvider", () => {
  const mockRuntime: IAgentRuntime = {
    getSetting: vi.fn((key: string) => {
      switch (key) {
        case "INITIA_PRIVATE_KEY":
          // Valid private key (64 hex chars without 0x prefix)
          return "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
        case "INITIA_NODE_URL":
          return "https://lcd.testnet.initia.xyz";
        case "INITIA_CHAIN_ID":
          return "initiation-2";
        default:
          return null;
      }
    }),
  } as unknown as IAgentRuntime;

  it("should initialize with private key", async () => {
    const provider = new WalletProvider(mockRuntime);
    await provider.initialize(mockRuntime);
    expect(provider).toBeDefined();
  });

  it("should get wallet address", async () => {
    const provider = new WalletProvider(mockRuntime);
    await provider.initialize(mockRuntime);
    expect(() => provider.getAddress()).not.toThrow();
  });

  it("should throw error without configuration", async () => {
    const invalidRuntime = {
      ...mockRuntime,
      getSetting: vi.fn(() => null),
    } as unknown as IAgentRuntime;

    await expect(async () => {
      const provider = new WalletProvider(invalidRuntime);
      await provider.initialize(invalidRuntime);
    }).rejects.toThrow(
      "Either INITIA_PRIVATE_KEY or INITIA_MNEMONIC must be configured"
    );
  });
});
