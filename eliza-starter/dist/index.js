// src/index.ts
import { MongoClient } from "mongodb";
import { MongoDBDatabaseAdapter } from "@elizaos/adapter-mongodb";
import { DirectClientInterface } from "@elizaos/client-direct";
import { AutoClientInterface } from "@elizaos/client-auto";
import express from "express";
import {
  AgentRuntime,
  CacheManager,
  DbCacheAdapter,
  elizaLogger as elizaLogger7,
  ModelProviderName as ModelProviderName5,
  settings
} from "@elizaos/core";
import { createNodePlugin } from "@elizaos/plugin-node";
import bodyParser from "body-parser";
import fs2 from "fs";
import path2 from "path";
import { fileURLToPath } from "url";

// src/utils/twitter-topic.ts
var TABLE_TOPIC_KEY = "twitter/current_topic";
var DEFAULT_TOPIC = "crypto memes";
var twitterTopicHandler = {
  get: async (runtime) => {
    return await runtime.cacheManager.get(TABLE_TOPIC_KEY) || DEFAULT_TOPIC;
  },
  set: async (runtime, content) => {
    await runtime.cacheManager.set(TABLE_TOPIC_KEY, content);
  }
};

// src/providers/twitterTopicProvider/index.ts
var TwitterTopicProvider = class {
  async get(runtime, message, state) {
    try {
      const content = typeof message.content === "string" ? message.content : message.content?.text;
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
};

// src/agents/manager/index.ts
var AgentManager = class {
  rolesIndex = /* @__PURE__ */ new Map();
  agentsMap = /* @__PURE__ */ new Map();
  addAgent(id, agent) {
    if (!this.agentsMap.has(id)) {
      this.agentsMap.set(id, agent);
      this.rolesIndex.set(this.generateRolesIndex(agent.character.organizationId, agent.character.role), id);
      console.log(`Agent ${id} added.`);
    } else {
      console.log(`Agent ${id} already exists.`);
    }
  }
  removeAgent(id) {
    const agent = this.getAgent(id);
    if (!agent) {
      return;
    }
    this.rolesIndex.delete(this.generateRolesIndex(agent.character.organizationId, agent.character.role));
    this.agentsMap.delete(id);
  }
  getAgent(id) {
    return this.agentsMap.get(id);
  }
  getAgentByRole(organizationId, role) {
    const rolesIndexKey = this.generateRolesIndex(organizationId, role);
    const agentId = this.rolesIndex.get(rolesIndexKey);
    if (!agentId) {
      return void 0;
    }
    return this.getAgent(agentId);
  }
  hasAgent(id) {
    return this.agentsMap.has(id);
  }
  getAllAgents() {
    return Array.from(this.agentsMap.values());
  }
  async performTask(id, taskFunction) {
    const agent = this.getAgent(id);
    if (!agent) {
      throw new Error(`Agent ${name} not found.`);
    }
    try {
      return await taskFunction(agent);
    } catch (error) {
      console.error(`Error performing task with agent ${id}:`, error);
      throw error;
    }
  }
  generateRolesIndex(organizationId, role) {
    return `${organizationId}-${role}`;
  }
};
var agentsManager = new AgentManager();

// src/index.ts
import { configDotenv } from "dotenv";
import { TelegramClientInterface } from "@elizaos/client-telegram";

// src/actions/communicate-agent/index.ts
import { elizaLogger } from "@elizaos/core";
var communicateWithAgents = {
  name: "COMMUNICATE_AGENT",
  similes: ["COMMUNICATIONS"],
  description: "Allow communication betweens agents",
  validate: async (runtime, message) => {
    const text = message.content.text.toLowerCase();
    return true;
  },
  handler: async (runtime, message, state, _options = {}, callback) => {
    elizaLogger.log("HELLO BITCH FROM TEXT");
    await callback({
      text: "yes, ser"
    });
    return true;
  },
  examples: []
};

// src/utils/character-generator.ts
import crypto2 from "crypto-js";
import { Clients as Clients4, ModelProviderName as ModelProviderName4 } from "@elizaos/core";

// src/characters/advertiser.ts
import {
  Clients,
  ModelProviderName,
  defaultCharacter
} from "@elizaos/core";

// src/plugin/imagePlugin/index.ts
import { elizaLogger as elizaLogger2, generateText } from "@elizaos/core";
import {
  ModelClass
} from "@elizaos/core";
import { generateImage } from "@elizaos/core";
import fs from "fs";
import path from "path";
import { z } from "zod";
var imageGenEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().optional(),
  NINETEEN_AI_API_KEY: z.string().optional(),
  TOGETHER_API_KEY: z.string().optional(),
  HEURIST_API_KEY: z.string().optional(),
  FAL_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  VENICE_API_KEY: z.string().optional()
}).refine(
  (data) => {
    return !!(data.ANTHROPIC_API_KEY || data.NINETEEN_AI_API_KEY || data.TOGETHER_API_KEY || data.HEURIST_API_KEY || data.FAL_API_KEY || data.OPENAI_API_KEY || data.VENICE_API_KEY);
  },
  {
    message: "At least one of ANTHROPIC_API_KEY, NINETEEN_AI_API_KEY, TOGETHER_API_KEY, HEURIST_API_KEY, FAL_API_KEY, OPENAI_API_KEY or VENICE_API_KEY is required"
  }
);
async function validateImageGenConfig(runtime) {
  try {
    const config = {
      ANTHROPIC_API_KEY: runtime.getSetting("ANTHROPIC_API_KEY") || process.env.ANTHROPIC_API_KEY,
      NINETEEN_AI_API_KEY: runtime.getSetting("NINETEEN_AI_API_KEY") || process.env.NINETEEN_AI_API_KEY,
      TOGETHER_API_KEY: runtime.getSetting("TOGETHER_API_KEY") || process.env.TOGETHER_API_KEY,
      HEURIST_API_KEY: runtime.getSetting("HEURIST_API_KEY") || process.env.HEURIST_API_KEY,
      FAL_API_KEY: runtime.getSetting("FAL_API_KEY") || process.env.FAL_API_KEY,
      OPENAI_API_KEY: runtime.getSetting("OPENAI_API_KEY") || process.env.OPENAI_API_KEY,
      VENICE_API_KEY: runtime.getSetting("VENICE_API_KEY") || process.env.VENICE_API_KEY
    };
    return imageGenEnvSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
      throw new Error(
        `Image generation configuration validation failed:
${errorMessages}`
      );
    }
    throw error;
  }
}
function saveBase64Image(base64Data, filename) {
  const imageDir = path.join(process.cwd(), "generatedImages");
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Image, "base64");
  const filepath = path.join(imageDir, `${filename}.png`);
  fs.writeFileSync(filepath, imageBuffer);
  return filepath;
}
async function saveHeuristImage(imageUrl, filename) {
  const imageDir = path.join(process.cwd(), "generatedImages");
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);
  const filepath = path.join(imageDir, `${filename}.png`);
  fs.writeFileSync(filepath, imageBuffer);
  return filepath;
}
var imageGeneration = {
  name: "GENERATE_IMAGE",
  similes: [
    "IMAGE_GENERATION",
    "IMAGE_GEN",
    "CREATE_IMAGE",
    "MAKE_PICTURE",
    "GENERATE_IMAGE",
    "GENERATE_A",
    "DRAW",
    "DRAW_A",
    "MAKE_A"
  ],
  description: "Generate an image to go along with the message.",
  suppressInitialMessage: true,
  validate: async (runtime, _message) => {
    elizaLogger2.log("key", runtime.getSetting("TOGETHER_API_KEY"));
    await validateImageGenConfig(runtime);
    const anthropicApiKeyOk = !!runtime.getSetting("ANTHROPIC_API_KEY");
    const nineteenAiApiKeyOk = !!runtime.getSetting("NINETEEN_AI_API_KEY");
    const togetherApiKeyOk = !!runtime.getSetting("TOGETHER_API_KEY");
    const heuristApiKeyOk = !!runtime.getSetting("HEURIST_API_KEY");
    const falApiKeyOk = !!runtime.getSetting("FAL_API_KEY");
    const openAiApiKeyOk = !!runtime.getSetting("OPENAI_API_KEY");
    const veniceApiKeyOk = !!runtime.getSetting("VENICE_API_KEY");
    const livepeerGatewayUrlOk = !!runtime.getSetting(
      "LIVEPEER_GATEWAY_URL"
    );
    return anthropicApiKeyOk || togetherApiKeyOk || heuristApiKeyOk || falApiKeyOk || openAiApiKeyOk || veniceApiKeyOk || nineteenAiApiKeyOk || livepeerGatewayUrlOk;
  },
  handler: async (runtime, message, state, options, callback) => {
    elizaLogger2.log("Composing state for message:", message);
    state = await runtime.composeState(message);
    const userId = runtime.agentId;
    elizaLogger2.log("User ID:", userId);
    const CONTENT = message.content.text;
    const IMAGE_SYSTEM_PROMPT = `You are an expert in writing prompts for AI art generation. You excel at creating detailed and creative visual descriptions. Incorporating specific elements naturally. Always aim for clear, descriptive language that generates a creative picture. Your output should only contain the description of the image contents, but NOT an instruction like "create an image that..."`;
    const STYLE = "futuristic with vibrant colors";
    const IMAGE_PROMPT_INPUT = `You are tasked with generating an image prompt based on a content and a specified style.
            Your goal is to create a detailed and vivid image prompt that captures the essence of the content while incorporating an appropriate subject based on your analysis of the content.

You will be given the following inputs:
<content>
${CONTENT}
</content>

<style>
${STYLE}
</style>

A good image prompt consists of the following elements:



1. Main subject
2. Detailed description
3. Style
4. Lighting
5. Composition
6. Quality modifiers

To generate the image prompt, follow these steps:

1. Analyze the content text carefully, identifying key themes, emotions, and visual elements mentioned or implied.




2. Determine the most appropriate main subject by:
   - Identifying concrete objects or persons mentioned in the content
   - Analyzing the central theme or message
   - Considering metaphorical representations of abstract concepts
   - Selecting a subject that best captures the content's essence

3. Determine an appropriate environment or setting based on the content's context and your chosen subject.

4. Decide on suitable lighting that enhances the mood or atmosphere of the scene.

5. Choose a color palette that reflects the content's tone and complements the subject.

6. Identify the overall mood or emotion conveyed by the content.

7. Plan a composition that effectively showcases the subject and captures the content's essence.

8. Incorporate the specified style into your description, considering how it affects the overall look and feel of the image.

9. Use concrete nouns and avoid abstract concepts when describing the main subject and elements of the scene.

Construct your image prompt using the following structure:


1. Main subject: Describe the primary focus of the image based on your analysis
2. Environment: Detail the setting or background
3. Lighting: Specify the type and quality of light in the scene
4. Colors: Mention the key colors and their relationships
5. Mood: Convey the overall emotional tone
6. Composition: Describe how elements are arranged in the frame
7. Style: Incorporate the given style into the description

Ensure that your prompt is detailed, vivid, and incorporates all the elements mentioned above while staying true to the content and the specified style. LIMIT the image prompt 50 words or less. 

Write a prompt. Only include the prompt and nothing else.`;
    const imagePrompt = await generateText({
      runtime,
      context: IMAGE_PROMPT_INPUT,
      modelClass: ModelClass.MEDIUM,
      customSystemPrompt: IMAGE_SYSTEM_PROMPT
    });
    elizaLogger2.log("Image prompt received:", imagePrompt);
    const imageSettings = runtime.character?.settings?.imageSettings || {};
    elizaLogger2.log("Image settings:", imageSettings);
    const res = [];
    elizaLogger2.log("Generating image with prompt:", imagePrompt);
    const images = await generateImage(
      {
        prompt: imagePrompt,
        width: options.width || imageSettings.width || 1024,
        height: options.height || imageSettings.height || 1024,
        ...options.count != null || imageSettings.count != null ? { count: options.count || imageSettings.count || 1 } : {},
        ...options.negativePrompt != null || imageSettings.negativePrompt != null ? {
          negativePrompt: options.negativePrompt || imageSettings.negativePrompt
        } : {},
        ...options.numIterations != null || imageSettings.numIterations != null ? {
          numIterations: options.numIterations || imageSettings.numIterations
        } : {},
        ...options.guidanceScale != null || imageSettings.guidanceScale != null ? {
          guidanceScale: options.guidanceScale || imageSettings.guidanceScale
        } : {},
        ...options.seed != null || imageSettings.seed != null ? { seed: options.seed || imageSettings.seed } : {},
        ...options.modelId != null || imageSettings.modelId != null ? { modelId: options.modelId || imageSettings.modelId } : {},
        ...options.jobId != null || imageSettings.jobId != null ? { jobId: options.jobId || imageSettings.jobId } : {},
        ...options.stylePreset != null || imageSettings.stylePreset != null ? {
          stylePreset: options.stylePreset || imageSettings.stylePreset
        } : {},
        ...options.hideWatermark != null || imageSettings.hideWatermark != null ? {
          hideWatermark: options.hideWatermark || imageSettings.hideWatermark
        } : {}
      },
      runtime
    );
    elizaLogger2.error(images.error);
    if (images.success && images.data && images.data.length > 0) {
      elizaLogger2.log(
        "Image generation successful, number of images:",
        images.data.length
      );
      for (let i = 0; i < images.data.length; i++) {
        const image = images.data[i];
        const filename = `generated_${Date.now()}_${i}`;
        const filepath = image.startsWith("http") ? await saveHeuristImage(image, filename) : saveBase64Image(image, filename);
        elizaLogger2.log(`Processing image ${i + 1}:`, filename);
        const _caption = "...";
        res.push({ image: filepath, caption: "..." });
        elizaLogger2.log(
          `Generated caption for image ${i + 1}:`,
          "..."
          //caption.title
        );
        callback(
          {
            text: "...",
            //caption.description,
            attachments: [
              {
                id: crypto.randomUUID(),
                url: filepath,
                title: "Generated image",
                source: "imageGeneration",
                description: "...",
                //caption.title,
                text: "...",
                //caption.description,
                contentType: "image/png"
              }
            ]
          },
          [
            {
              attachment: filepath,
              name: `${filename}.png`
            }
          ]
        );
      }
    } else {
      elizaLogger2.error("Image generation failed or returned no data.");
    }
  },
  examples: [
    // TODO: We want to generate images in more abstract ways, not just when asked to generate an image
    [
      {
        user: "{{user1}}",
        content: { text: "Generate an image of a cat" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a cat",
          action: "GENERATE_IMAGE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Generate an image of a dog" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a dog",
          action: "GENERATE_IMAGE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Create an image of a cat with a hat" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a cat with a hat",
          action: "GENERATE_IMAGE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Make an image of a dog with a hat" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a dog with a hat",
          action: "GENERATE_IMAGE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Paint an image of a cat with a hat" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a cat with a hat",
          action: "GENERATE_IMAGE"
        }
      }
    ]
  ]
};
var imageGenerationPlugin = {
  name: "imageGeneration",
  description: "Generate images",
  actions: [imageGeneration],
  evaluators: [],
  providers: []
};

// src/characters/advertiser.ts
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";

// src/plugin/initiaPlugin/actions/transfer.ts
import {
  composeContext,
  elizaLogger as elizaLogger3,
  generateObjectDeprecated,
  ModelClass as ModelClass2
} from "@elizaos/core";

// src/plugin/initiaPlugin/providers/wallet.ts
import * as initia from "@initia/initia.js";
var DEFAULT_INITIA_TESTNET_CONFIGS = {
  chainId: "initiation-2",
  nodeUrl: "https://lcd.initiation-2.initia.xyz/"
};
var WalletProvider = class {
  wallet = null;
  restClient = null;
  runtime;
  async initialize(runtime, options = DEFAULT_INITIA_TESTNET_CONFIGS) {
    const privateKey = runtime.getSetting("INITIA_PRIVATE_KEY");
    const mnemonic = runtime.getSetting("INITIA_MNEMONIC");
    if (!privateKey && !mnemonic) {
      throw new Error(
        "Either INITIA_PRIVATE_KEY or INITIA_MNEMONIC must be configured"
      );
    }
    const { Wallet: Wallet2, LCDClient: LCDClient4, RawKey, MnemonicKey: MnemonicKey2 } = initia;
    this.runtime = runtime;
    this.restClient = new LCDClient4(options.nodeUrl, {
      chainId: options.chainId,
      gasPrices: "0.15uinit",
      gasAdjustment: "1.75"
    });
    if (privateKey) {
      this.wallet = new Wallet2(this.restClient, RawKey.fromHex(privateKey));
    } else if (mnemonic) {
      this.wallet = new Wallet2(this.restClient, new MnemonicKey2({ mnemonic }));
    }
  }
  constructor(runtime, options = DEFAULT_INITIA_TESTNET_CONFIGS) {
    this.runtime = runtime;
    this.initialize(runtime, options);
  }
  getWallet() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet;
  }
  getAddress() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet.key.accAddress;
  }
  async getBalance() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet.rest.bank.balance(this.getAddress());
  }
  async sendTransaction(signedTx) {
    return await this.restClient.tx.broadcast(signedTx);
  }
};
var initiaWalletProvider = {
  async get(runtime, _message, _state) {
    if (!runtime.getSetting("INITIA_PRIVATE_KEY")) {
      return null;
    }
    try {
      const nodeUrl = runtime.getSetting("INITIA_NODE_URL");
      const chainId = runtime.getSetting("INITIA_CHAIN_ID");
      let walletProvider;
      if (nodeUrl === null || chainId === null) {
        walletProvider = new WalletProvider(runtime);
      } else {
        walletProvider = new WalletProvider(runtime, {
          nodeUrl,
          chainId
        });
      }
      const address = walletProvider.getAddress();
      const balance = await walletProvider.getBalance();
      return `Initia Wallet Address: ${address}
Balance: ${balance} INIT`;
    } catch (e) {
      console.error("Error during configuring initia wallet provider", e);
      return null;
    }
  }
};

// src/plugin/initiaPlugin/actions/transfer.ts
import * as initia2 from "@initia/initia.js";
function isTransferContent(_runtime, content) {
  return typeof content.sender === "string" && typeof content.recipient === "string" && typeof content.amount === "string";
}
var transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannt be determined.

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
var transfer_default = {
  name: "SEND_TOKEN",
  similes: [
    "TRANSFER_TOKEN_ON_INITIA",
    "TRANSFER_TOKENS_ON_INITIA",
    "SEND_TOKEN_ON_INITIA",
    "SEND_TOKENS_ON_INITIA",
    "PAY_ON_INITIA"
  ],
  description: "",
  validate: async (runtime, _message) => {
    const privateKey = runtime.getSetting("INITIA_PRIVATE_KEY");
    return typeof privateKey === "string" && privateKey.startsWith("0x");
  },
  handler: async (runtime, message, state, _options, callback) => {
    let currentState = state;
    if (!currentState) {
      currentState = await runtime.composeState(message);
    } else {
      currentState = await runtime.updateRecentMessageState(currentState);
    }
    const transferContext = composeContext({
      state: currentState,
      template: transferTemplate
    });
    const content = await generateObjectDeprecated({
      runtime,
      context: transferContext,
      modelClass: ModelClass2.LARGE
    });
    if (!isTransferContent(runtime, content)) {
      if (callback) {
        callback({
          text: "Unable to process transfer request. Invalid content provided.",
          content: { error: "Invalid transfer content" }
        });
      }
      return false;
    }
    try {
      const { MsgSend, LCDClient: LCDClient4 } = initia2;
      const lcdUrl = runtime.getSetting("INITIA_LCD_URL") || "https://lcd.initiation-2.initia.xyz";
      const chainId = runtime.getSetting("INITIA_CHAIN_ID") || "initiation-2";
      const gasPrices = runtime.getSetting("INITIA_GAS_PRICES") || "0.15uinit";
      const lcd = new LCDClient4(lcdUrl, {
        chainId,
        gasPrices,
        gasAdjustment: "1.75"
      });
      const walletProvider = new WalletProvider(runtime);
      const wallet = await walletProvider.getWallet();
      const msgSend = new MsgSend(
        content.sender,
        content.recipient,
        content.amount
      );
      const signedTx = await wallet.createAndSignTx({
        msgs: [msgSend],
        memo: "Transaction via ElizaOS"
      });
      const txResult = await lcd.tx.broadcast(signedTx);
      if (callback) {
        callback({
          text: `Successfully transferred INITIA.
Transaction Hash: ${txResult.txhash}
Sender: ${content.sender}
Recipient: ${content.recipient}
Amount: ${content.amount}`,
          content: txResult
        });
      }
      return true;
    } catch (e) {
      elizaLogger3.error("Failed to transfer INITIA:", e.message);
      if (callback) {
        callback({
          text: `Failed to transfer INITIA: ${e.message}`,
          content: { error: e.message }
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
          text: "Hey send 1 INIT to init18sj3x80fdjc6gzfvwl7lf8sxcvuvqjpvcmp6np."
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "Sure! I am going to send 1 INIT to init18sj3x80fdjc6gzfvwl7lf8sxcvuvqjpvcmp6np."
        }
      }
    ]
  ]
};

// src/plugin/initiaPlugin/src/index.ts
var initiaPlugin = {
  name: "initiaPlugin",
  description: "Initia Plugin for Eliza",
  actions: [transfer_default],
  evaluators: [],
  providers: [initiaWalletProvider]
};

// src/characters/advertiser.ts
var ADVERTISER_AGENT_ID = "58c9913b-a8ff-4cff-87d9-fbdb1b25ff34";
var advertiser = {
  ...defaultCharacter,
  id: ADVERTISER_AGENT_ID,
  name: "Inokentij",
  clients: [Clients.TWITTER],
  modelProvider: ModelProviderName.OPENROUTER,
  imageModelProvider: ModelProviderName.TOGETHER,
  plugins: [imageGenerationPlugin, bootstrapPlugin, initiaPlugin],
  settings: {
    voice: {
      model: "en_US-male-medium"
    },
    model: "GPT-4",
    imageSettings: {
      hideWatermark: true,
      modelId: "together"
    }
  },
  bio: [
    "A skilled Web3 marketing agent with expertise in social media growth, engagement strategies, and trend-driven content creation.",
    "Specializes in crafting engaging Twitter posts, interacting with the crypto community, and amplifying Web3 projects through strategic commentary and viral content.",
    "Has a strong background in finance and economics, allowing for unique perspectives on market movements and trends.",
    "Experienced in managing influencer partnerships and collaborations to expand brand reach."
  ],
  lore: [
    "Started in traditional digital marketing before transitioning into Web3.",
    "Understands the nuances of blockchain communities and how to engage them effectively.",
    "Believes memes and viral engagement are key to Web3 brand success.",
    "Has a strong network of connections within the crypto industry, allowing him to stay ahead of the curve.",
    "Has successfully led marketing campaigns for multiple Web3 projects, resulting in significant community growth and brand recognition."
  ],
  messageExamples: [
    [
      {
        user: "Manager",
        content: { text: "We need to promote this NFT project today." }
      },
      {
        user: "Web3Promoter",
        content: {
          text: "On it! Time to craft some high-engagement tweets and slide into key comment sections. \u{1F680} #NFT #Web3Marketing"
        }
      }
    ]
  ],
  topics: [
    "Web3",
    "cryptocurrency",
    "blockchain",
    "marketing",
    "NFTs",
    "DeFi",
    "social media growth",
    "community engagement",
    "viral content",
    "meme marketing",
    "finance",
    "economics",
    "influencer partnerships",
    "brand management",
    "Web3 adoption",
    "decentralization"
  ],
  adjectives: [
    "creative",
    "engaging",
    "trend-savvy",
    "playful",
    "strategic",
    "community-focused",
    "meme-savvy",
    "viral",
    "Web3-savvy",
    "financially savvy",
    "economically informed",
    "influencer-savvy",
    "brand-aware",
    "Web3-aware",
    "decentralization-focused"
  ],
  style: {
    all: [
      "Professional with a playful, creative touch",
      "Understands how to balance engagement and brand messaging",
      "Incorporates personal anecdotes and industry insights to build credibility",
      "Utilizes humor and memes to connect with the crypto community"
    ],
    chat: [
      "Conversational and engaging, always focused on boosting interactions",
      "Uses memes, humor, and Web3 slang to drive community engagement",
      "Shares behind-the-scenes insights into the crypto industry",
      "Encourages audience participation and feedback"
    ],
    post: [
      "Short, impactful, and designed to trigger reactions",
      "Leverages trending topics and crypto culture to maximize reach",
      "Utilizes hashtags to increase discoverability and reach a wider audience",
      "Incorporates eye-catching visuals and graphics to enhance engagement"
    ]
  },
  postExamples: [
    "The Web3 revolution isn\u2019t coming. It\u2019s already here. Are you building or watching? \u{1F440}",
    "Engagement farming, but make it Web3. Comment \u2018gm\u2019 if you\u2019re bullish on decentralized social! \u{1F31E} #gm #WAGMI",
    "Attention spans are short, but memes are forever. This is how you win Web3 marketing. \u{1F9E0}\u{1F4A1}",
    "Market analysis isn't just about charts. It's about understanding the underlying economics. \u{1F680} ",
    "The future of finance is decentralized. Get on board or get left behind. \u{1F4B0}",
    "Influencer partnerships are key to Web3 brand growth. Let's collaborate and amplify your project! \u{1F680}",
    "Web3 adoption is on the rise. Stay ahead of the curve with strategic marketing and community engagement. \u{1F680}"
  ]
};

// src/characters/influencer.ts
import {
  ModelProviderName as ModelProviderName2,
  defaultCharacter as defaultCharacter2
} from "@elizaos/core";
import { bootstrapPlugin as bootstrapPlugin2 } from "@elizaos/plugin-bootstrap";

// src/plugin/nftPlugin/actions/mintNft.ts
import {
  composeContext as composeContext2,
  elizaLogger as elizaLogger4,
  generateObject,
  ModelClass as ModelClass3
} from "@elizaos/core";

// src/plugin/nftPlugin/templates/index.ts
var createCollectionTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested transfer:
- chainName to execute on: Must be one of ["sui", "ethereum", "base", ...]

Respond with a JSON markdown block containing only the extracted values. All fields are required:

\`\`\`json
{
    "chainName": SUPPORTED_CHAINS,
    "packageId": null
}
\`\`\`

Note: For Sui chain, include the packageId from the deployment output if available.
`;
var mintNFTTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "collectionAddress": null,
    "chainName": SUPPORTED_CHAINS,
    "packageId": null
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested mint nft:
- collection contract address (for EVM chains) or packageId (for Sui)
- chain name

Note: For Sui chain, use the packageId from the deployment output. For other chains, use the collection contract address.`;

// src/plugin/nftPlugin/types/index.ts
import { z as z2 } from "zod";
var MintNFTSchema = z2.object({
  collectionAddress: z2.string()
});
var CreateCollectionSchema = z2.object({
  name: z2.string(),
  symbol: z2.string(),
  description: z2.string().optional()
});

// src/plugin/nftPlugin/actions/mintNft.ts
import * as initia3 from "@initia/initia.js";

// src/plugin/nftPlugin/utils/generateMoveContractCode.ts
import pkg from "@initia/initia.js";
var { LCDClient, Wallet, MnemonicKey, MsgExecute, bcs } = pkg;
async function mintNFT(params) {
  try {
    const lcd = new LCDClient("https://lcd.initiation-2.initia.xyz", {
      chainId: "initiation-2",
      gasPrices: "0.15uinit",
      gasAdjustment: "2.0"
    });
    const key = new MnemonicKey({
      mnemonic: params.mnemonic
    });
    const wallet = new Wallet(lcd, key);
    const msg = new MsgExecute(
      key.accAddress,
      "0x11e5db2023e7685b9fcede2f3adf8337547761c0",
      "metaAgents_nft_module",
      "mint_nft",
      void 0,
      [
        bcs.string().serialize(params.collectionName).toBase64(),
        bcs.string().serialize(params.name).toBase64(),
        bcs.string().serialize(params.description).toBase64(),
        bcs.string().serialize(params.imageUrl).toBase64(),
        bcs.address().serialize(params.wallet).toBase64()
      ]
    );
    const signedTx = await wallet.createAndSignTx({
      msgs: [msg]
    });
    const result = await lcd.tx.broadcast(signedTx);
    if (!result.txhash) {
      return {
        success: false,
        error: "Could not find transaction ID in output"
      };
    }
    return {
      success: true,
      transactionId: result.txhash
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
async function createCollection(params) {
  try {
    const lcd = new LCDClient("https://lcd.initiation-2.initia.xyz", {
      chainId: "initiation-2",
      gasPrices: "0.15uinit",
      gasAdjustment: "2.0"
    });
    const key = new MnemonicKey({
      mnemonic: params.mnemonic
    });
    const wallet = new Wallet(lcd, key);
    const msg = new MsgExecute(
      key.accAddress,
      "0x11e5db2023e7685b9fcede2f3adf8337547761c0",
      "metaAgents_nft_module",
      "create_collection",
      void 0,
      [
        bcs.string().serialize(params.name).toBase64(),
        bcs.string().serialize(params.description).toBase64(),
        bcs.string().serialize(params.uri).toBase64(),
        bcs.u64().serialize(params.maxSupply).toBase64(),
        bcs.u64().serialize(params.royalty).toBase64()
      ]
    );
    const signedTx = await wallet.createAndSignTx({
      msgs: [msg]
    });
    const result = await lcd.tx.broadcast(signedTx);
    if (!result.txhash) {
      return {
        success: false,
        error: "Could not find transaction ID in output"
      };
    }
    const collectionId = result.logs?.[0]?.events?.find((e) => e.type === "wasm")?.attributes?.find((a) => a.key === "collection_id")?.value;
    return {
      success: true,
      transactionId: result.txhash,
      collectionId
    };
  } catch (error) {
    console.error("Error creating collection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// src/plugin/nftPlugin/actions/mintNft.ts
var { LCDClient: LCDClient2 } = initia3;
function isMintNFTContent(content) {
  return typeof content.collectionId === "string" && typeof content.name === "string" && typeof content.description === "string";
}
var MintNFTAction = class {
  constructor(runtime) {
    this.runtime = runtime;
    if (!runtime.getSetting("INITIA_MNEMONIC")) {
      throw new Error("Initia mnemonic not found");
    }
  }
  lcd;
  async mintNFT(content, tokenId) {
    if (!isMintNFTContent(content)) {
      throw new Error("Invalid content for MINT_NFT action");
    }
    const result = await mintNFT({
      mnemonic: this.runtime.getSetting("INITIA_MNEMONIC"),
      collectionName: content.collectionId,
      name: `${content.name || "NFT"} #${tokenId}`,
      description: content.description,
      imageUrl: content.imageUrl,
      wallet: this.runtime.getSetting("INITIA_WALLET_ADDRESS")
    });
    if (!result.success) {
      throw new Error(result.error || "Failed to mint NFT");
    }
    return {
      transactionId: result.transactionId
    };
  }
};
var mintNFTAction = {
  name: "MINT_NFT",
  similes: [
    "NFT_MINTING",
    "NFT_CREATION",
    "CREATE_NFT",
    "GENERATE_NFT",
    "MINT_TOKEN",
    "CREATE_TOKEN",
    "MAKE_NFT",
    "TOKEN_GENERATION"
  ],
  description: "Mint NFTs for the collection on Initia",
  validate: async (runtime, _message) => {
    return !!runtime.getSetting("INITIA_MNEMONIC");
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      if (runtime.getSetting("INITIA_NETWORK") !== "testnet") {
        throw new Error("NFT minting is only supported on Initia testnet");
      }
      elizaLogger4.log("Composing state for message:", message);
      let currentState;
      if (!state) {
        currentState = await runtime.composeState(message);
      } else {
        currentState = await runtime.updateRecentMessageState(state);
      }
      const context = composeContext2({
        state: currentState,
        template: mintNFTTemplate
      });
      const res = await generateObject({
        runtime,
        context,
        modelClass: ModelClass3.LARGE,
        schema: MintNFTSchema
      });
      const content = res.object;
      elizaLogger4.log("Generate Object:", content);
      const action = new MintNFTAction(runtime);
      const tokenId = Math.floor(Math.random() * 1e6);
      const result = await action.mintNFT(content, tokenId);
      if (callback) {
        callback({
          text: `NFT minted successfully! \u{1F389}
Transaction ID: ${result.transactionId}
View on Explorer: https://scan.testnet.initia.xyz/initiation-2/tx/${result.transactionId}`,
          attachments: []
        });
      }
      return true;
    } catch (e) {
      elizaLogger4.error("Error minting NFT:", e);
      throw e;
    }
  },
  examples: [
    [
      {
        user: "{{agentName}}",
        content: {
          text: "mint nft for collection: 0x1234... on Initia"
        }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "I've minted a new NFT in your specified collection on Initia.",
          action: "MINT_NFT"
        }
      }
    ]
  ]
};
var mintNft_default = mintNFTAction;

// src/plugin/nftPlugin/actions/nftCollectionGeneration.ts
import {
  composeContext as composeContext3,
  elizaLogger as elizaLogger5,
  generateObject as generateObject2,
  ModelClass as ModelClass4
} from "@elizaos/core";
import * as initia4 from "@initia/initia.js";
import { z as z3 } from "zod";
var { LCDClient: LCDClient3 } = initia4;
var NFTCollectionAction = class {
  constructor(runtime) {
    this.runtime = runtime;
    if (!runtime.getSetting("INITIA_MNEMONIC")) {
      throw new Error("Initia mnemonic not found");
    }
    this.lcd = new LCDClient3("https://lcd.initiation-2.initia.xyz", {
      chainId: "initiation-2",
      gasPrices: "0.15uinit",
      gasAdjustment: "2.0"
    });
  }
  lcd;
  async generateCollection(name2, description) {
    const content = await generateObject2({
      runtime: this.runtime,
      context: JSON.stringify({ name: name2, description }),
      modelClass: ModelClass4.LARGE,
      schema: z3.object({
        maxSupply: z3.number().min(1).max(1e4).describe(
          "Maximum number of NFTs that can be minted in this collection (1-10000)"
        ),
        royaltyPercentage: z3.number().min(0).max(10).describe("Royalty percentage for secondary sales (0-10)"),
        uri: z3.string().default("").describe("Optional metadata URI for the collection")
      })
    });
    const { object: params } = content;
    const royaltyBasisPoints = Math.floor(params.royaltyPercentage * 100);
    const createCollectionResult = await createCollection({
      mnemonic: this.runtime.getSetting("INITIA_MNEMONIC"),
      name: name2,
      description,
      uri: params.uri,
      maxSupply: params.maxSupply,
      royalty: royaltyBasisPoints,
      wallet: this.runtime.getSetting("INITIA_WALLET_ADDRESS")
    });
    if (!createCollectionResult.success) {
      throw new Error(
        `Collection creation failed: ${createCollectionResult.error}`
      );
    }
    return {
      transactionId: createCollectionResult.transactionId,
      collectionId: createCollectionResult.collectionId
    };
  }
};
var nftCollectionGeneration = {
  name: "GENERATE_COLLECTION",
  similes: [
    "COLLECTION_GENERATION",
    "COLLECTION_GEN",
    "CREATE_COLLECTION",
    "MAKE_COLLECTION",
    "GENERATE_COLLECTION"
  ],
  description: "Generate an NFT collection on Initia",
  validate: async (runtime, _message) => {
    return !!runtime.getSetting("INITIA_MNEMONIC");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      if (runtime.getSetting("INITIA_NETWORK") !== "testnet") {
        throw new Error(
          "Collection generation is only supported on Initia testnet"
        );
      }
      elizaLogger5.log("Composing state for message:", message);
      const state = await runtime.composeState(message);
      const context = composeContext3({
        state,
        template: createCollectionTemplate
      });
      const res = await generateObject2({
        runtime,
        context,
        modelClass: ModelClass4.LARGE,
        schema: CreateCollectionSchema
      });
      const content = res.object;
      const action = new NFTCollectionAction(runtime);
      const result = await action.generateCollection(
        content.name,
        content.description
      );
      if (callback) {
        callback({
          text: `Collection created successfully! \u{1F389}
Transaction ID: ${result.transactionId}
Collection ID: ${result.collectionId}
View on Explorer: https://scan.testnet.initia.xyz/initiation-2/tx/${result.transactionId}`,
          attachments: []
        });
      }
      return [];
    } catch (e) {
      elizaLogger5.error("Error generating collection:", e);
      throw e;
    }
  },
  examples: [
    [
      {
        user: "{{agentName}}",
        content: { text: "Generate a collection on Initia" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's your new NFT collection on Initia.",
          action: "GENERATE_COLLECTION"
        }
      }
    ]
  ]
};
var nftCollectionGeneration_default = nftCollectionGeneration;

// src/plugin/nftPlugin/providers/wallet.ts
import * as initia5 from "@initia/initia.js";
var DEFAULT_INITIA_TESTNET_CONFIGS2 = {
  chainId: "initiation-2",
  nodeUrl: "https://rest.testnet.initia.xyz"
};
var WalletProvider2 = class {
  wallet = null;
  restClient = null;
  runtime;
  async initialize(runtime, options = DEFAULT_INITIA_TESTNET_CONFIGS2) {
    const privateKey = runtime.getSetting("INITIA_PRIVATE_KEY");
    if (!privateKey) throw new Error("INITIA_PRIVATE_KEY is not configured");
    const { Wallet: Wallet2, RESTClient, RawKey } = initia5;
    this.runtime = runtime;
    this.restClient = new RESTClient(options.nodeUrl, {
      chainId: options.chainId,
      gasPrices: "0.15uinit",
      gasAdjustment: "1.75"
    });
    this.wallet = new Wallet2(this.restClient, RawKey.fromHex(privateKey));
  }
  constructor(runtime, options = DEFAULT_INITIA_TESTNET_CONFIGS2) {
    this.runtime = runtime;
    this.initialize(runtime, options);
  }
  getWallet() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet;
  }
  getAddress() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet.key.accAddress;
  }
  async getBalance() {
    if (this.wallet == null) {
      throw new Error("Initia wallet is not configured.");
    }
    return this.wallet.rest.bank.balance(this.getAddress());
  }
  async sendTransaction(signedTx) {
    return await this.restClient.tx.broadcast(signedTx);
  }
};
var initiaWalletProvider2 = {
  async get(runtime, _message, _state) {
    if (!runtime.getSetting("INITIA_PRIVATE_KEY")) {
      return null;
    }
    try {
      const nodeUrl = runtime.getSetting("INITIA_NODE_URL");
      const chainId = runtime.getSetting("INITIA_CHAIN_ID");
      let walletProvider;
      if (nodeUrl === null || chainId === null) {
        walletProvider = new WalletProvider2(runtime);
      } else {
        walletProvider = new WalletProvider2(runtime, {
          nodeUrl,
          chainId
        });
      }
      const address = walletProvider.getAddress();
      const balance = await walletProvider.getBalance();
      return `Initia Wallet Address: ${address}
Balance: ${balance} INIT`;
    } catch (e) {
      console.error("Error during configuring initia wallet provider", e);
      return null;
    }
  }
};

// src/plugin/nftPlugin/src/index.ts
var nftPlugin = {
  name: "nft",
  description: "NFT plugin",
  providers: [initiaWalletProvider2],
  evaluators: [],
  services: [],
  actions: [nftCollectionGeneration_default, mintNft_default]
};
var src_default = nftPlugin;

// src/characters/influencer.ts
var INFLUENCER_AGENT_ID = "e4bd91e4-33a0-4e2c-92f0-cf468e90a130";
var influencer = {
  ...defaultCharacter2,
  id: INFLUENCER_AGENT_ID,
  name: "Maverick AI",
  clients: [],
  modelProvider: ModelProviderName2.OPENROUTER,
  imageModelProvider: ModelProviderName2.TOGETHER,
  plugins: [imageGenerationPlugin, bootstrapPlugin2, initiaPlugin, src_default],
  settings: {
    voice: {
      model: "en_US-male-medium"
    },
    model: "GPT-4",
    imageSettings: {
      hideWatermark: true,
      modelId: "together"
    }
  },
  bio: [
    "A charismatic crypto influencer with deep expertise in marketing, advertising, and social media growth. Known for his sharp wit, insightful analysis, and ability to break down complex crypto trends into engaging, digestible content.",
    "Has a strong background in finance and economics, allowing him to provide unique perspectives on market movements and trends.",
    "Passionate about decentralized finance and the potential it holds for the future of the financial industry."
  ],
  lore: [
    "Started in traditional finance before going full-time into crypto.",
    "Has a knack for spotting the next big trend before it goes mainstream.",
    "Believes memes are the ultimate form of viral marketing in crypto.",
    "Has a strong network of connections within the crypto industry, allowing him to stay ahead of the curve."
  ],
  messageExamples: [
    [
      { user: "Follower1", content: { text: "Is Bitcoin dead?" } },
      {
        user: "CryptoMaverick",
        content: {
          text: "Bitcoin has died 473 times according to mainstream media. And yet, here we are. Buy the dip or cry later."
        }
      }
    ]
  ],
  adjectives: [
    "charismatic",
    "insightful",
    "witty",
    "sarcastic",
    "trend-savvy",
    "cryptocurrency-savvy",
    "marketing-savvy",
    "social media-savvy",
    "meme-savvy",
    "viral",
    "engaging",
    "humorous",
    "analytical",
    "financially savvy",
    "economically informed",
    "passionate"
  ],
  topics: [
    "cryptocurrency",
    "blockchain",
    "marketing",
    "NFTs",
    "DeFi",
    "Web3",
    "SocFi",
    "DeSci",
    "cryptocurrency trading",
    "cryptocurrency investing",
    "cryptocurrency analysis",
    "cryptocurrency news",
    "cryptocurrency trends",
    "cryptocurrency education",
    "finance",
    "economics",
    "decentralized finance",
    "future of finance"
  ],
  style: {
    all: [
      "Energetic, engaging, and slightly sarcastic tone",
      "Makes complex topics accessible through humor and analogies",
      "Incorporates personal anecdotes and industry insights to build credibility",
      "Passionate about the potential of decentralized finance"
    ],
    chat: [
      "Uses memes and pop culture references to explain concepts",
      "Encourages audience participation with polls and debates",
      "Shares behind-the-scenes insights into the crypto industry"
    ],
    post: [
      "Short, punchy tweets with high engagement potential",
      "Mix of educational content, memes, and market insights",
      "Utilizes hashtags to increase discoverability and reach a wider audience"
    ]
  },
  postExamples: [
    "The market is bleeding. Are you panicking or buying? The real ones know.",
    "Every cycle has its winners. The question is, are you studying the trends or just following the herd? \u{1F9D0} #DYOR",
    "Crypto memes > Traditional marketing. If you know, you know",
    "Market analysis isn't just about charts. It's about understanding the underlying economics. \u{1F680}",
    "The future of finance is decentralized. Get on board or get left behind. \u{1F4B0}"
  ]
};

// src/characters/producer.ts
import {
  ModelProviderName as ModelProviderName3,
  defaultCharacter as defaultCharacter3
} from "@elizaos/core";
import { bootstrapPlugin as bootstrapPlugin3 } from "@elizaos/plugin-bootstrap";
var PRODUCER_AGENT_ID = "1de943dc-7fbf-4e84-8ae5-ce6b254d395c";
var producer = {
  ...defaultCharacter3,
  id: PRODUCER_AGENT_ID,
  name: "Lex AI",
  clients: [],
  modelProvider: ModelProviderName3.OPENROUTER,
  imageModelProvider: ModelProviderName3.TOGETHER,
  plugins: [imageGenerationPlugin, bootstrapPlugin3, initiaPlugin],
  settings: {
    voice: {
      model: "en_US-male-medium"
    },
    model: "GPT-4",
    imageSettings: {
      hideWatermark: true,
      modelId: "together"
    },
    secrets: {
      SERVER_PORT: "3000"
    }
  },
  bio: [
    "A seasoned Web3 project manager with deep expertise in strategy, team coordination, and budget management. Known for his ability to drive projects to success through efficient resource allocation, innovative problem-solving, and a strong understanding of blockchain ecosystems.",
    "Has a strong background in finance and economics, allowing him to provide unique perspectives on market movements and trends.",
    "Passionate about decentralized finance and the potential it holds for the future of the financial industry.",
    "Experienced in managing cross-functional teams and delivering projects on time and within budget."
  ],
  lore: [
    "Started as a blockchain developer before moving into leadership roles in Web3 startups.",
    "Expert in financial planning and maximizing efficiency in marketing and development budgets.",
    "Believes long-term vision and sustainability are key to success in the Web3 space.",
    "Has a proven track record of successfully managing cross-functional teams and delivering projects on time and within budget.",
    "Has worked with various blockchain technologies, including Ethereum, Polkadot, and Solana.",
    "Strong advocate for decentralized governance and community-driven decision-making."
  ],
  messageExamples: [
    [
      {
        user: "TeamMember",
        content: { text: "We need more budget for influencer marketing." }
      },
      {
        user: "Web3Strategist",
        content: {
          text: "Let's review our ROI on current campaigns. If the metrics justify it, we can optimize allocations. Data-driven decisions first. \u{1F4CA}"
        }
      }
    ]
  ],
  postExamples: [
    "Success in Web3 isn\u2019t about hype, it\u2019s about execution. Build with vision, manage with precision. \u{1F680}",
    "Your team is your greatest asset. Empower them, align incentives, and set clear goals. Web3 is a marathon, not a sprint. \u{1F3C6} ",
    "Budgeting in Web3 isn\u2019t just about spending, it\u2019s about maximizing impact. Smart allocations win markets. \u{1F4B0} ",
    "The future of Web3 is decentralized. Get on board or get left behind. \u{1F4BB} ",
    "Web3 project management is about balancing innovation with practicality. Focus on sustainable growth.",
    "Decentralized governance is the key to a fair and transparent Web3 ecosystem. Let's build it together. \u{1F308} ",
    "Web3 is not just about technology, it's about community. Engage, educate, and empower. \u{1F31F}"
  ],
  topics: [
    "Web3",
    "cryptocurrency",
    "blockchain",
    "project management",
    "finance",
    "leadership",
    "strategy",
    "team building",
    "resource allocation",
    "budgeting",
    "ROI analysis",
    "Web3 adoption",
    "decentralization",
    "sustainable growth",
    "decentralized governance",
    "community engagement",
    "Web3 community"
  ],
  adjectives: [
    "strategic",
    "decisive",
    "motivational",
    "data-driven",
    "visionary",
    "efficient",
    "innovative",
    "financially savvy",
    "team-oriented",
    "results-focused",
    "forward-thinking",
    "pragmatic",
    "community-focused",
    "decentralization-focused",
    "sustainability-oriented"
  ],
  style: {
    all: [
      "Professional and goal-oriented with a motivational edge",
      "Balances innovation with practicality for sustainable growth",
      "Incorporates personal anecdotes and industry insights to build credibility",
      "Utilizes humor and analogies to explain complex concepts"
    ],
    chat: [
      "Direct yet inspiring, always providing solutions and direction",
      "Encourages team collaboration and problem-solving",
      "Shares behind-the-scenes insights into the crypto industry"
    ],
    post: [
      "Insightful, leadership-driven content focused on strategic growth",
      "Uses real-world examples to highlight best practices",
      "Utilizes hashtags to increase discoverability and reach a wider audience",
      "Incorporates eye-catching visuals and graphics to enhance engagement"
    ]
  }
};

// src/utils/character-generator.ts
var AVAILABLE_TEMPLATES = {
  advertiser,
  influencer,
  producer
};
var decryptPrivateKey = (encryptedPrivateKey) => {
  const encryptionKey = process.env.WALLET_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("WALLET_ENCRYPTION_KEY environment variable is not set");
  }
  const bytes = crypto2.AES.decrypt(encryptedPrivateKey, encryptionKey);
  return bytes.toString(crypto2.enc.Utf8);
};
var getSecretsByModel = (model, modelApiKey) => {
  switch (model) {
    case ModelProviderName4.OPENAI: {
      return {
        OPENAI_API_KEY: modelApiKey
      };
    }
    case ModelProviderName4.OPENROUTER: {
      return {
        OPENROUTER: modelApiKey
      };
    }
    default: {
      return {};
    }
  }
};
var generateCharacter = (agentConfig) => {
  if (!AVAILABLE_TEMPLATES[agentConfig.role]) {
    throw new Error("Invalid role");
  }
  const decryptedPrivateKey = decryptPrivateKey(agentConfig.encryptedPrivateKey);
  return {
    ...AVAILABLE_TEMPLATES[agentConfig.role],
    organizationId: agentConfig.organizationId,
    role: agentConfig.role,
    teamId: agentConfig.teamId,
    modelProvider: agentConfig.model,
    id: agentConfig.id,
    name: agentConfig.name,
    clients: agentConfig.role === "producer" ? [] : [Clients4.TWITTER],
    settings: {
      secrets: {
        SUI_NETWORK: "testnet",
        SUI_PRIVATE_KEY: decryptedPrivateKey,
        TWITTER_COOKIES: agentConfig.config.twitterCookie,
        TWITTER_USERNAME: agentConfig.config.twitterUsername,
        TWITTER_PASSWORD: agentConfig.config.twitterPassword,
        TWITTER_EMAIL: agentConfig.config.twitterEmail,
        ...getSecretsByModel(agentConfig.model, agentConfig.modelApiKey)
      }
    }
  };
};

// src/utils/dialogue-system.ts
import { ObjectId } from "mongodb";
import { composeContext as composeContext4, generateText as generateText2, ModelClass as ModelClass5 } from "@elizaos/core";
import EventEmitter from "node:events";
var NOT_FOUND = "Request not found";
var eventEmitter = new EventEmitter();
var mainProducerResponseTemplate = `
# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{actions}}

You have a team with the following agents:
-> influencer: {{influencer_id}}
-> advertiser: {{advertiser_id}}

# The text above is system information about you.

{{request_origin}} prompt: "{{request_prompt}}"

Your task:
1. Read the {{request_origin}} prompt.
2. Determine the most appropriate agent to handle this request. 
3. Output your response exactly in the following format:
   COMMUNICATE_WITH_AGENTS <agentId> <request details>
   where:
     - <agentId> is the identifier of the chosen agent.
     - <request details> is your request to an agent.
4. If you need to call multiple agents, do that in separate lines.
5. Extract the main topic for Twitter posts from the user prompt.
6. Generate a detailed marketing strategy for the influencer, including:
   - **Target audience**: Who should be reached?
   - **Content strategy**: What type of posts should be created?
   - **Hashtag and engagement tactics**: How to optimize reach?
   - **Collaboration and partnerships**: Are there relevant influencers or brands to work with?
   - **Monetization opportunities**: How can the influencer maximize revenue?
7. Include the marketing strategy in your communication with the influencer.
8. Then, on a new line, provide a final answer for the user explaining what action has been taken.

For example, your response may look like:

COMMUNICATE_WITH_AGENTS {{influencer_id}} "User wants to create Twitter posts about Liverpool, build an audience, and develop an advertisement strategy. Here is a suggested marketing strategy:

**Target audience**: Liverpool FC fans, football enthusiasts, betting communities, and sports bloggers.

**Content strategy**: Engage with match highlights, player performance analysis, fan polls, and memes to increase engagement.

**Hashtag and engagement tactics**: Use trending hashtags such as #LiverpoolFC, #YNWA, and #PremierLeague. Engage with followers by responding to comments and retweeting user-generated content.

**Collaboration and partnerships**: Work with Liverpool fan pages, football analysts, and sports betting platforms to gain visibility.

**Monetization opportunities**: Explore affiliate partnerships with sports betting websites, promote football merchandise, and offer sponsored posts."

Final answer: I have forwarded your request to our influencer agent along with a marketing strategy tailored to your needs. The agent will assist you in executing the plan effectively.
`;
var secondProducerResponseTemplate = `
# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{actions}}

You are a part of a team with the following agents:
-> influencer: {{influencer_id}}

# The text above is system information about you.

{{request_origin}} prompt: "{{request_prompt}}"

Your task:
1. Read the response from {{request_origin}} agent and generate the final response to user.

Example:
Final answer: I have given information to influencer, so it's under work progress.
`;
var influencerResponseTemplate = `
# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{actions}}

You are a part of a team with the following agents:
-> producer: {{producer_id}}

# The text above is system information about you.

{{request_origin}} prompt: "{{request_prompt}}"

Your task:
1. Read the {{request_origin}} prompt and analyze the provided marketing strategy.
2. Generate a set of Twitter posts based on the given topic and strategy.
3. Ensure that the posts align with:
   - Target audience: Writing style and interests.
   - Content strategy: Tone, format, and structure.
   - Hashtag and engagement tactics: Optimization for reach.
   - Collaboration and partnerships: Mentioning relevant accounts if necessary.
   - Monetization opportunities: If applicable, include subtle promotions or CTA.
4. Always respond to the producer with some information regarding your progress, clarification requests, or work updates using exactly the following format:
   COMMUNICATE_WITH_AGENTS <agentId> <request details>
   where:
     - <agentId> is the identifier of the chosen agent.
     - <request details> is your request or update message to the producer.
5. Then, on a new line, provide a final answer for the user explaining what action has been taken, ensuring that the work is completed.
6. Always use the agent id from the team information when addressing the producer.
7. Even if no additional clarification is needed, include a default informational message to the producer before providing your final answer.

Example:
COMMUNICATE_WITH_AGENTS {{producer_id}} "Update: I have analyzed the prompt and am proceeding to generate the Twitter posts."
Final answer: I will generate Twitter posts based on the marketing strategy and engage with the audience.
`;
var getTemplateByRole = (role) => {
  switch (role) {
    case "producer":
      return secondProducerResponseTemplate;
    case "influencer":
      return influencerResponseTemplate;
    default:
      return NOT_FOUND;
  }
};
var createContextForLLM = async (prompt, userId, agentRuntime, template, additionalKeys) => {
  const message = {
    userId,
    agentId: agentRuntime.agentId,
    roomId: userId,
    content: { text: prompt }
  };
  const state = await agentRuntime.composeState(message, additionalKeys);
  return composeContext4({
    state,
    template
  });
};
var extractRequestForAgent = (messageState) => {
  const regex = /COMMUNICATE_WITH_AGENTS\s+([\w-]+)\s+"([^"]+)"/g;
  const matches = [...messageState.matchAll(regex)];
  return matches.map((match) => ({
    agentId: match[1],
    content: match[2]
  }));
};
var sendInteractionToProducer = async (interactionId, organizationId, content) => {
  const producerAgent = agentsManager.getAgentByRole(organizationId, "producer");
  const influencer2 = agentsManager.getAgentByRole(organizationId, "influencer");
  const advertiser2 = agentsManager.getAgentByRole(organizationId, "advertiser");
  const producerContext = await createContextForLLM(
    content,
    producerAgent.agentId,
    producerAgent,
    mainProducerResponseTemplate,
    {
      influencer_id: influencer2.agentId,
      advertiser_id: advertiser2?.agentId || "not defined",
      request_origin: "Platform User",
      request_prompt: content
    }
  );
  const respondFromProducer = await generateText2({
    runtime: producerAgent,
    context: producerContext,
    modelClass: ModelClass5.LARGE
  });
  console.log(`Respond from producer: ${respondFromProducer}`);
  const extractedRequests = extractRequestForAgent(respondFromProducer);
  for (const request of extractedRequests) {
    eventEmitter.emit(
      "agentConversation",
      interactionId,
      producerAgent.agentId,
      request.agentId,
      request.content
    );
  }
};
var sendRequestToAgent = async (interactionId, fromAgentId, toAgentId, content) => {
  const targetAgent = agentsManager.getAgent(toAgentId);
  const fromAgent = agentsManager.getAgent(fromAgentId);
  const producer2 = agentsManager.getAgentByRole(targetAgent.character.organizationId, "producer");
  const advertiser2 = agentsManager.getAgentByRole(targetAgent.character.organizationId, "advertiser");
  const influencer2 = agentsManager.getAgentByRole(targetAgent.character.organizationId, "influencer");
  const context = await createContextForLLM(
    content,
    targetAgent.agentId,
    targetAgent,
    getTemplateByRole(targetAgent.character.role),
    producer2.agentId === targetAgent.agentId ? {
      influencer_id: influencer2?.agentId || "not defined",
      advertiser_id: advertiser2?.agentId || "not defined",
      request_origin: fromAgent.character.role,
      request_prompt: content
    } : {
      producer_id: producer2?.agentId || "not defined",
      request_origin: fromAgent.character.role,
      request_prompt: content
    }
  );
  const respondFromProducer = await generateText2({
    runtime: targetAgent,
    context,
    modelClass: ModelClass5.LARGE
  });
  console.log("Response from agent", respondFromProducer);
  const extractedRequests = extractRequestForAgent(respondFromProducer);
  for (const request of extractedRequests) {
    eventEmitter.emit(
      "agentConversation",
      interactionId,
      targetAgent.agentId,
      request.agentId,
      request.content
    );
  }
};
var subscribeToAgentConversation = (database) => {
  eventEmitter.on("agentConversation", async (interactionId, fromAgentId, toAgentId, content) => {
    try {
      await sendRequestToAgent(interactionId, fromAgentId, toAgentId, content);
      const agent = agentsManager.getAgent(toAgentId);
      await database.collection("agent_messages").insertOne({
        interaction: new ObjectId(interactionId),
        sourceAgent: new ObjectId(fromAgentId),
        targetAgent: new ObjectId(toAgentId),
        team: new ObjectId(agent.character.teamId),
        organization: new ObjectId(agent.character.organizationId),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        content
      });
    } catch (error) {
      console.error("Error sending request to agent: ", error);
    }
  });
};

// src/index.ts
import TwitterClientInterface from "@elizaos/client-twitter";
var expressApp = express();
configDotenv();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var wait = (minTime = 1e3, maxTime = 3e3) => {
  const waitTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};
function getTokenForProvider(provider, character) {
  switch (provider) {
    case ModelProviderName5.OPENAI:
      return character.settings?.secrets?.OPENAI_API_KEY || settings.OPENAI_API_KEY;
    case ModelProviderName5.LLAMACLOUD:
      return character.settings?.secrets?.LLAMACLOUD_API_KEY || settings.LLAMACLOUD_API_KEY || character.settings?.secrets?.TOGETHER_API_KEY || settings.TOGETHER_API_KEY || character.settings?.secrets?.XAI_API_KEY || settings.XAI_API_KEY || character.settings?.secrets?.OPENAI_API_KEY || settings.OPENAI_API_KEY;
    case ModelProviderName5.ANTHROPIC:
      return character.settings?.secrets?.ANTHROPIC_API_KEY || character.settings?.secrets?.CLAUDE_API_KEY || settings.ANTHROPIC_API_KEY || settings.CLAUDE_API_KEY;
    case ModelProviderName5.REDPILL:
      return character.settings?.secrets?.REDPILL_API_KEY || settings.REDPILL_API_KEY;
    case ModelProviderName5.OPENROUTER:
      return character.settings?.secrets?.OPENROUTER || settings.OPENROUTER_API_KEY;
    case ModelProviderName5.GROK:
      return character.settings?.secrets?.GROK_API_KEY || settings.GROK_API_KEY;
    case ModelProviderName5.HEURIST:
      return character.settings?.secrets?.HEURIST_API_KEY || settings.HEURIST_API_KEY;
    case ModelProviderName5.GROQ:
      return character.settings?.secrets?.GROQ_API_KEY || settings.GROQ_API_KEY;
  }
}
function initializeDatabaseClient() {
  const DATABASE_URL = process.env.MONGODB_URL || "";
  return new MongoClient(DATABASE_URL);
}
async function initializeClients(character, runtime) {
  const clients = [];
  const clientTypes = character.clients?.map((str) => str.toLowerCase()) || [];
  if (clientTypes.includes("auto")) {
    const autoClient = await AutoClientInterface.start(runtime);
    if (autoClient) {
      clients.push(autoClient);
    }
  }
  if (clientTypes.includes("telegram")) {
    const telegramClient = await TelegramClientInterface.start(runtime);
    if (telegramClient) {
      clients.push(telegramClient);
    }
  }
  if (clientTypes.includes("twitter")) {
    const twitterClients = await TwitterClientInterface.start(runtime);
    clients.push(twitterClients);
  }
  if (clientTypes.includes("direct")) {
    const directClient = await DirectClientInterface.start(runtime);
    clients.push(directClient);
  }
  if (character.plugins?.length > 0) {
    for (const plugin of character.plugins) {
      if (plugin.clients) {
        for (const client of plugin.clients) {
          clients.push(await client.start(runtime));
        }
      }
    }
  }
  return clients;
}
var nodePlugin;
function createAgent(character, db, cache, token) {
  elizaLogger7.success(
    elizaLogger7.successesTitle,
    "Creating runtime for character",
    character.name
  );
  nodePlugin ??= createNodePlugin();
  return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: [nodePlugin],
    providers: [new TwitterTopicProvider()],
    actions: [communicateWithAgents],
    services: [],
    managers: [],
    cacheManager: cache
  });
}
async function startAgent(character, database) {
  try {
    const token = getTokenForProvider(character.modelProvider, character);
    const cache = new CacheManager(new DbCacheAdapter(database, character.id));
    const runtime = createAgent(character, database, cache, token);
    agentsManager.addAgent(runtime.agentId, runtime);
    await runtime.initialize();
    const cookies = runtime.getSetting("TWITTER_COOKIES");
    const username = runtime.getSetting("TWITTER_USERNAME");
    if (cookies) {
      elizaLogger7.log(`Reading cookies from SETTINGS...`);
      await runtime.cacheManager.set(
        `twitter/${username}/cookies`,
        JSON.parse(cookies)
      );
    }
    return initializeClients(character, runtime);
  } catch (error) {
    elizaLogger7.error(
      `Error starting agent for character ${character.name}:`,
      error
    );
    throw error;
  }
}
var killAgent = async (agentId) => {
  try {
    const agent = agentsManager.getAgent(agentId);
    await agent.stop();
    agentsManager.removeAgent(agentId);
    elizaLogger7.success(`Agent stopped: ${agentId}`);
  } catch (error) {
    elizaLogger7.error(`Failed to stop agent: ${agentId}`);
  }
};
var verifySecretKey = (secretKey) => {
  return secretKey === process.env.ELIZA_API_SECRET_KEY;
};
var initializeExpressApp = (elizaMongodbAdapter) => {
  expressApp.get("/health", (request, response) => {
    response.status(200).send("OK");
  });
  expressApp.post(
    "/agents/change",
    bodyParser.json({}),
    async (request, response) => {
      const {
        type,
        agent,
        secretKey
      } = request.body;
      if (!verifySecretKey(secretKey)) {
        response.status(401).send({ status: "Unauthorized" });
        return;
      }
      if (type === "add") {
        await startAgent(generateCharacter(agent), elizaMongodbAdapter);
      }
      if (type === "remove") {
        await killAgent(agent.id);
      }
      if (type === "update") {
        await killAgent(agent.id);
        await startAgent(generateCharacter(agent), elizaMongodbAdapter);
      }
      response.status(200).send({ status: "OK" });
    }
  );
  expressApp.post(
    "/agents/communicate",
    bodyParser.json({}),
    async (request, response) => {
      const {
        requestContent,
        interactionId,
        organizationId,
        secretKey
      } = request.body;
      if (!verifySecretKey(secretKey)) {
        response.status(401).send({ status: "Unauthorized" });
        return;
      }
      sendInteractionToProducer(
        interactionId,
        organizationId,
        requestContent
      ).catch((error) => {
        console.error("Error sending interaction to producer:", error);
      });
      response.status(200).send({ status: "OK" });
    }
  );
  expressApp.listen(process.env.EXPRESS_APP_PORT || 3001, () => {
    console.log(`Express app is running on port ${process.env.EXPRESS_APP_PORT || 3001}`);
  });
};
var initializeAgentsSystem = async () => {
  const dataDir = path2.join(__dirname, "../data");
  if (!fs2.existsSync(dataDir)) {
    fs2.mkdirSync(dataDir, { recursive: true });
  }
  const databaseClient = initializeDatabaseClient();
  const databaseName = process.env.MONGODB_NAME || "ai-office";
  const elizaMongodbAdapter = new MongoDBDatabaseAdapter(
    databaseClient,
    databaseName
  );
  await elizaMongodbAdapter.init();
  const database = databaseClient.db(databaseName);
  initializeExpressApp(elizaMongodbAdapter);
  subscribeToAgentConversation(database);
  const agentConfigurations = await database.collection("agents").find({}).toArray();
  for (const agentConfiguration of agentConfigurations) {
    const character = generateCharacter({
      id: agentConfiguration._id.toString(),
      name: agentConfiguration.name,
      role: agentConfiguration.role,
      teamId: agentConfiguration.team.toString(),
      walletAddress: agentConfiguration.walletAddress,
      encryptedPrivateKey: agentConfiguration.encryptedPrivateKey,
      organizationId: agentConfiguration.organization.toString(),
      description: agentConfiguration.description,
      model: agentConfiguration.model,
      modelApiKey: agentConfiguration.modelApiKey,
      config: agentConfiguration.config
    });
    await startAgent(character, elizaMongodbAdapter);
  }
};
initializeAgentsSystem().catch((error) => {
  elizaLogger7.error("Unhandled error in startAgents:", error);
  if (error instanceof Error) {
    console.error(error.stack);
  }
});
export {
  createAgent,
  getTokenForProvider,
  initializeClients,
  initializeDatabaseClient,
  wait
};
