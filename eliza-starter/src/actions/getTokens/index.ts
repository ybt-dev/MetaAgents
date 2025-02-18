import { Action, IAgentRuntime, Memory, State, HandlerCallback, ActionExample, Validator } from "@elizaos/core";
import { LatestTokenProfilesProvider } from "../../providers/dexProvider";

export class TokenProfilesAction implements Action {
    name = "GET_TOKEN_PROFILES";
    similes = ["FETCH_TOKEN_PROFILES", "LIST_TOKEN_PROFILES", "TOKEN_PROFILES"];
    description = "Fetches and returns a list of the latest token profiles";
    suppressInitialMessage = true;

    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const provider = runtime.providers.find(p => p instanceof LatestTokenProfilesProvider);
            if (!provider) {
                throw new Error("Token profiles provider not found");
            }

            console.log("Fetching latest token profiles...");
            const profilesData = await provider.get(runtime, message, state);
            console.log("Received token profiles:", profilesData);

            if (!Array.isArray(profilesData)) {
                throw new Error("Invalid response format");
            }
            

            const formattedProfiles = JSON.parse(profilesData).slice(0, 5).map(profile => (
                `🔹 **${profile.header}**
    - Chain: ${profile.chainId}
    - Address: ${profile.tokenAddress}
    - Description: ${profile.description}
    - [View on DexScreener](${profile.url})`
            )).join("\n\n");

            const responseText = formattedProfiles || "No token profiles found.";

            if (callback) {
                await callback({
                    text: responseText,
                    action: this.name
                });
            }

            if (state) {
                state.responseData = {
                    text: responseText,
                    action: this.name
                };
            }

            return true;
        } catch (error) {
            console.error("Error in token profiles action handler:", error);

            if (callback) {
                await callback({
                    text: `Sorry, I couldn't fetch the token profiles: ${error.message}`,
                    action: this.name
                });
            }

            return false;
        }
    }
    examples: ActionExample[][];
    validate: Validator;
}

export const tokenProfilesAction = new TokenProfilesAction();
