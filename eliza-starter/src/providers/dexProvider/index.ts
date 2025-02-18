import { Provider, IAgentRuntime, Memory, State } from "@elizaos/core";

const LATEST_TOKEN_PROFILES = "https://api.dexscreener.com/token-profiles/latest/v1";

export interface TokenProfileData {
    url: string;
    chainId: string;
    tokenAddress: string;
    amount?: number;
    totalAmount?: number;
    icon: string;
    header: string;
    description: string;
    links: {
        type: string;
        label: string;
        url: string;
    }[];
}
  
export class LatestTokenProfilesProvider implements Provider {
    async get(runtime: IAgentRuntime, message: Memory, state?: State): Promise<string> {
        try {
            const content = typeof message.content === 'string'
                ? message.content
                : message.content?.text;

            if (!content) {
                throw new Error("No message content provided");
            }

            const response = await fetch(LATEST_TOKEN_PROFILES);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json() as TokenProfileData[];
            return JSON.stringify(data);

        } catch (error) {
            console.error("LatestTokenProfilesProvider error:", error);
            return `Error: ${error.message}`;
        }
    }
}

export const tokenPriceProvider = new LatestTokenProfilesProvider();
