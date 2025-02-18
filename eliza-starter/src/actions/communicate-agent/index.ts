import { Action, Content, elizaLogger, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";

export const communicateWithAgents: Action = {
    name: "COMMUNICATE_AGENT",
    similes: ["COMMUNICATIONS"],
    description: "Allow communication betweens agents",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = (message.content as Content).text.toLowerCase();
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<any> => {
        elizaLogger.log("HELLO BITCH FROM TEXT")
        await callback({
            text: "yes, ser",
        });
        return true;
    },
    examples: [],
};
