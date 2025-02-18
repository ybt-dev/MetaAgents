import { TwitterClientInterface } from '@elizaos/client-twitter';
import { elizaLogger } from '@elizaos/core';

// Monkey patching the TwitterPostClient
(function patchTwitterPostClient() {
    const originalPostMessage = TwitterClientInterface.constructor.prototype.post?.prototype.sendMessage;

    if (!originalPostMessage) {
        elizaLogger.error('Unable to find the sendMessage method. Check the library version.');
        return;
    }

    TwitterClientInterface.constructor.prototype.post.prototype.sendMessage = async function (message: string, options: any) {
        elizaLogger.log("LOG FROM MONKEY PATCHING");
        elizaLogger.log('Extended sendMessage called with:', { message, options });

        // Add your custom logic here
        if (!options?.tags) {
            options.tags = ['default-tag'];
        }

        // Call the original method
        const result = await originalPostMessage.call(this, message, options);

        // Add custom post-processing if needed
        elizaLogger.log('Message sent successfully:', result);
        return result;
    };
})();
