import { IAgentRuntime, Provider, State, Memory } from "@elizaos/core";
import { twitterTopicHandler } from "../../utils/twitter-topic.ts";

export class TwitterTopicProvider implements Provider {
    async get(runtime: IAgentRuntime, message: Memory, state?: State): Promise<string> {
        try {
            const content = typeof message.content === 'string'
                ? message.content
                : message.content?.text;

            if (!content) {
                throw new Error("No message content provided");
            }

            const topicFromDB = await twitterTopicHandler.get(runtime);

            return `Use this topic: ${topicFromDB} as a main topic for tweet generation`;
        } catch (error) {
            console.error("TwitterTopicProvider error:", error);
            return `Error: ${error.message}`;
        }
    }
}
