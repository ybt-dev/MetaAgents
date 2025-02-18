import { Plugin } from "@elizaos/core";
import transfer from "../actions/transfer.ts";
import { initiaWalletProvider } from "../providers/wallet.ts";

export const initiaPlugin: Plugin = {
  name: "initiaPlugin",
  description: "Initia Plugin for Eliza",
  actions: [transfer],
  evaluators: [],
  providers: [initiaWalletProvider],
};

// INITIA_PRIVATE_KEY=0x1234...abcd
// INITIA_NODE_URL=https://...
// INITIA_CHAIN_ID=initiaion-2
