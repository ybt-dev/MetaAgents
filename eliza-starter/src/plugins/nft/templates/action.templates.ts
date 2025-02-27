export const generateNftCollectionTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{providers}}

Extract the following information about the requested NFT collection:
- name: The name of the NFT collection.
- description: A brief description of the NFT collection.
- maxSupply: The maximum number of NFTs in the collection.
- royaltyPercentage: The royalty percentage (as a number) that the creator will receive from secondary sales.

Respond with a JSON markdown block containing only the extracted values. All fields are required:

\`\`\`json
{
    "name": "COLLECTION_NAME",
    "description": "COLLECTION_DESCRIPTION",
    "maxSupply": MAX_SUPPLY,
    "royaltyPercentage": ROYALTY_PERCENTAGE
}
\`\`\`

Note: Ensure that the name and description are accurately extracted based on the provided messages and wallet information.
`;

export const generateNftCollectionImageTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

Generate a logo with the text "{{collectionName}}".
`;
