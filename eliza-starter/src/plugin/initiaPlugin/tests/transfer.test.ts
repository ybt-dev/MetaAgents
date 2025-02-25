import { beforeEach, describe, expect, it, vi } from "vitest";
import transfer from "../actions/transfer";
import { IAgentRuntime, Memory, State } from "@elizaos/core";

// Mock the core module first
vi.mock("@elizaos/core", async () => {
  const actual = await vi.importActual("@elizaos/core");
  return {
    ...actual,
    isTransferContent: () => true,
    generateObjectDeprecated: () =>
      Promise.resolve({
        sender: "init1sender...",
        recipient: "init1recipient...",
        amount: "1000uinit",
      }),
    composeContext: () => ({
      content: {
        sender: "init1sender...",
        recipient: "init1recipient...",
        amount: "1000uinit",
      },
      recentMessages: "",
      bio: "",
      lore: "",
      messageDirections: "",
      postDirections: "",
      recentPosts: "",
      recentReplies: "",
      recentReactions: "",
      roomId: "123e4567-e89b-12d3-a456-426614174000",
      actors: "",
      recentMessagesData: "",
    }),
    validateTransferContent: () => true,
    parseTransferContent: () => ({
      sender: "init1sender...",
      recipient: "init1recipient...",
      amount: "1000uinit",
    }),
  };
});

describe("Transfer Action", () => {
  const mockRuntime: IAgentRuntime = {
    getSetting: vi.fn((key: string) => {
      switch (key) {
        case "INITIA_PRIVATE_KEY":
          return "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
        case "INITIA_LCD_URL":
          return "https://lcd.testnet.initia.xyz";
        case "INITIA_CHAIN_ID":
          return "initiation-2";
        default:
          return null;
      }
    }),
    composeState: vi.fn(),
    updateRecentMessageState: vi.fn(),
  } as unknown as IAgentRuntime;

  const mockMessage: Memory = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    userId: "123e4567-e89b-12d3-a456-426614174000",
    agentId: "123e4567-e89b-12d3-a456-426614174000",
    roomId: "123e4567-e89b-12d3-a456-426614174000",
    content: {
      text: "Send 1 INIT to init1234...",
    },
  };

  const mockState: State = {
    recentMessages: "",
    bio: "",
    lore: "",
    messageDirections: "",
    postDirections: "",
    recentPosts: "",
    recentReplies: "",
    recentReactions: "",
    roomId: "123e4567-e89b-12d3-a456-426614174000",
    actors: "",
    recentMessagesData: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate with valid private key", async () => {
    const isValid = await transfer.validate(mockRuntime, mockMessage);
    console.log("Validation result:", isValid);

    // Log the mock runtime settings to verify configuration
    console.log("Runtime settings:", {
      privateKey: mockRuntime.getSetting("INITIA_PRIVATE_KEY"),
      lcdUrl: mockRuntime.getSetting("INITIA_LCD_URL"),
      chainId: mockRuntime.getSetting("INITIA_CHAIN_ID"),
    });

    expect(isValid).toBe(true);
  });

  it("should fail validation without private key", async () => {
    const invalidRuntime = {
      ...mockRuntime,
      getSetting: vi.fn().mockReturnValue(null),
    };
    const isValid = await transfer.validate(invalidRuntime, mockMessage);
    expect(isValid).toBe(false);
  });

  it("should handle transfer with valid content", async () => {
    const mockCallback = vi.fn();
    const result = await transfer.handler(
      mockRuntime,
      mockMessage,
      mockState,
      {},
      mockCallback
    );
    expect(result).toBeDefined();
  });
});
