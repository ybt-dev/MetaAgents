import {
  Action,
  ActionExample,
  composeContext,
  Content,
  elizaLogger,
  generateObjectDeprecated,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  ModelClass,
  State,
} from "@elizaos/core";
import { WalletProvider } from "../providers/wallet.ts";
import * as initia from "@initia/initia.js";

export interface TransferContent extends Content {
  sender: string;
  recipient: string;
  amount: string;
}

function isTransferContent(
  _runtime: IAgentRuntime,
  content: unknown
): content is TransferContent {
  return (
    typeof (content as TransferContent).sender === "string" &&
    typeof (content as TransferContent).recipient === "string" &&
    typeof (content as TransferContent).amount === "string"
  );
}

const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannt be determined.

Example response:
\`\`\`json
{
    "sender": "init18sj3x80fdjc6gzfvwl7lf8sxcvuvqjpvcmp6np",
    "recipient": "init1kdwzpz3wzvpdj90gtga4fw5zm9tk4cyrgnjauu",
    "amount": "1000uinit",
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token transfer:
- Sender wallet address
- Recipient wallet address
- Amount to transfer

Respond with a JSON markdown block containing only the extracted values.`;

export default {
  name: "SEND_TOKEN",
  similes: [
    "TRANSFER_TOKEN_ON_INITIA",
    "TRANSFER_TOKENS_ON_INITIA",
    "SEND_TOKEN_ON_INITIA",
    "SEND_TOKENS_ON_INITIA",
    "PAY_ON_INITIA",
  ],
  description: "",
  validate: async (runtime: IAgentRuntime, _message: Memory) => {
    const privateKey = runtime.getSetting("INITIA_PRIVATE_KEY");
    const mnemonic = runtime.getSetting("INITIA_MNEMONIC");
    // Check for either private key or mnemonic
    return (
      (typeof privateKey === "string" && privateKey.length === 64) ||
      (typeof mnemonic === "string" && mnemonic.length > 0)
    );
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    callback?: HandlerCallback
  ): Promise<boolean> => {
    // Initialize or update state
    let currentState = state;
    if (!currentState) {
      currentState = (await runtime.composeState(message)) as State;
    } else {
      currentState = await runtime.updateRecentMessageState(currentState);
    }

    const transferContext = composeContext({
      state: currentState,
      template: transferTemplate,
    });

    const content = await generateObjectDeprecated({
      runtime,
      context: transferContext,
      modelClass: ModelClass.LARGE,
    });

    if (!isTransferContent(runtime, content)) {
      if (callback) {
        callback({
          text: "Unable to process transfer request. Invalid content provided.",
          content: { error: "Invalid transfer content" },
        });
      }
      return false;
    }

    try {
      const { MsgSend, LCDClient } = initia;

      // Initialize LCD client with proper configuration
      const lcdUrl =
        runtime.getSetting("INITIA_LCD_URL") ||
        "https://lcd.initiation-2.initia.xyz";
      const chainId = runtime.getSetting("INITIA_CHAIN_ID") || "initiation-2";
      const gasPrices = runtime.getSetting("INITIA_GAS_PRICES") || "0.15uinit";

      const lcd = new LCDClient(lcdUrl, {
        chainId: chainId,
        gasPrices: gasPrices,
        gasAdjustment: "1.75",
      });

      // Initialize and get wallet
      const walletProvider = new WalletProvider(runtime);
      await walletProvider.initialize();
      const wallet = await walletProvider.getWallet();

      // Create and sign transaction
      const msgSend = new MsgSend(
        content.sender,
        content.recipient,
        content.amount
      );
      const signedTx = await wallet.createAndSignTx({
        msgs: [msgSend],
        memo: "Transaction via ElizaOS",
      });

      // Broadcast transaction
      const txResult = await lcd.tx.broadcast(signedTx);

      if (callback) {
        callback({
          text: `Successfully transferred INITIA.
Transaction Hash: ${txResult.txhash}
Sender: ${content.sender}
Recipient: ${content.recipient}
Amount: ${content.amount}`,
          content: txResult,
        });
      }
      return true;
    } catch (e) {
      elizaLogger.error("Failed to transfer INITIA:", e.message);
      if (callback) {
        callback({
          text: `Failed to transfer INITIA: ${e.message}`,
          content: { error: e.message },
        });
      }
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Hey send 1 INIT to init18sj3x80fdjc6gzfvwl7lf8sxcvuvqjpvcmp6np.",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Sure! I am going to send 1 INIT to init18sj3x80fdjc6gzfvwl7lf8sxcvuvqjpvcmp6np.",
        },
      },
    ],
  ] as ActionExample[][],
} as Action;
