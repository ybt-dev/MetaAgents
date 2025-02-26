import { describe, expect, it, vi } from "vitest";
import { WalletProvider } from "../providers/wallet";
import { IAgentRuntime } from "@elizaos/core";

describe("WalletProvider", () => {
  const mockRuntime: IAgentRuntime = {
    getSetting: vi.fn((key: string) => {
      switch (key) {
        case "INITIA_PRIVATE_KEY":
          // Valid private key (64 hex chars without 0x prefix)
          return "032c755aba46338a8c86f583e1bb2a96a6dc6ae926246f15fffeabc01290da1c";
        // return "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
        case "INITIA_NODE_URL":
          return "https://lcd.initiation-2.initia.xyz";
        case "INITIA_CHAIN_ID":
          return "initiation-2";
        default:
          return null;
      }
    }),
  } as unknown as IAgentRuntime;

  it("should initialize with private key", async () => {
    const provider = new WalletProvider(mockRuntime);
    await provider.initialize();
    expect(provider).toBeDefined();
  });

  it("should get wallet address", async () => {
    const provider = new WalletProvider(mockRuntime);
    await provider.initialize();
    expect(() => provider.getAddress()).not.toThrow();
  });

  it("should throw error without configuration", async () => {
    const invalidRuntime = {
      ...mockRuntime,
      getSetting: vi.fn(() => null),
    } as unknown as IAgentRuntime;

    const provider = new WalletProvider(invalidRuntime);
    await expect(provider.initialize()).rejects.toThrow(
      "Either INITIA_PRIVATE_KEY or INITIA_MNEMONIC must be configured"
    );
  });
});
