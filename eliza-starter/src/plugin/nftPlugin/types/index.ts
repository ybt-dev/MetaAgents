import { z } from "zod";
import type { Content } from "@elizaos/core";

export interface MintNFTContent extends Content {
  collectionAddress: string;
}

export const MintNFTSchema = z.object({
  collectionAddress: z.string(),
});

export const CreateCollectionSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  description: z.string().optional(),
});

export interface MintNFTParams {
  collectionName: string;
  name: string;
  description: string;
  imageUrl: string;
  wallet: string;
  mnemonic: string;
}

export interface CreateCollectionParams {
  name: string;
  description: string;
  uri: string;
  maxSupply: number;
  royalty: number;
  wallet: string;
}
