import { z } from 'zod';

const generateNftCollectionSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  description: z.string().optional(),

  royaltyPercentage: z.number().min(0).max(10).describe('Royalty percentage for secondary sales (0-10)'),

  maxSupply: z
    .number()
    .min(1)
    .max(10000)
    .describe('Maximum number of NFTs that can be minted in this collection (1-10000)'),
});

export default generateNftCollectionSchema;
