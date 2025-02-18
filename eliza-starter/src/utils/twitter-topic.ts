import { IAgentRuntime } from "@elizaos/core";

export const TABLE_TOPIC_KEY = "twitter/current_topic";

const DEFAULT_TOPIC = "crypto memes";

export const twitterTopicHandler = {
    get: async (runtime: IAgentRuntime) => {
        return (await runtime.cacheManager.get<string>(TABLE_TOPIC_KEY)) || DEFAULT_TOPIC;
    },
    set: async (runtime: IAgentRuntime, content: string) => {
        await runtime.cacheManager.set(TABLE_TOPIC_KEY, content);
    }
}; 
