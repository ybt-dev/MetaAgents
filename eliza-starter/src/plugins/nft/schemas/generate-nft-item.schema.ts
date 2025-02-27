import { z } from 'zod';

const generateNftItemSchema = z.object({
  collectionName: z.string().min(1).describe('Name of the collection to mint the NFT in'),

  description: z.string().min(10).max(1000).describe('Detailed description of the NFT'),

  tokenId: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .describe('Unique identifier for the NFT within the collection (alphanumeric, underscore, and hyphen only)'),

  recipient: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .describe('Initia wallet address that will receive the NFT (0x format)'),
});

export default generateNftItemSchema;
