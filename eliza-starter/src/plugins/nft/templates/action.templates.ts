export const generateNftCollectionTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{providers}}

Extract the following information about the requested NFT collection:
- name: The name of the NFT collection.
- description: A brief description of the NFT collection.
- symbol: The symbol of the NFT collection.
- maxSupply: The maximum number of NFTs in the collection.
- royaltyPercentage: The royalty percentage (as a number) that the creator will receive from secondary sales. (from 0 to 100)

Respond with a JSON markdown block containing only the extracted values. All fields are required:

{
    "name": "COLLECTION_NAME",
    "description": "COLLECTION_DESCRIPTION",
    "symbol": "COLLECTION_SYMBOL",
    "maxSupply": MAX_SUPPLY,
    "royaltyPercentage": ROYALTY_PERCENTAGE
}

Note: Ensure that the name and description are accurately extracted based on the provided messages and wallet information.
Do not put json markdown block in response. Your message should be parseable via JSON.parse() function.
`;

export const generateNftCollectionImageTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

Generate a logo with the text "{{collectionName}}".
`;

export const generateNftItemTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{providers}}

Extract the following information about the NFT to be minted:
- collectionName: The name of the collection to mint the NFT in.
- description: A detailed description of the NFT.
- tokenId: A unique identifier for the NFT (should be unique within the collection).
- recipient: The wallet address that will receive the NFT.

Respond with a JSON markdown block containing only the extracted values. All fields are required:

{
    "collectionName": "COLLECTION_NAME",
    "description": "NFT_DESCRIPTION",
    "tokenId": "UNIQUE_TOKEN_ID",
    "recipient": "RECIPIENT_ADDRESS"
}

Note: Ensure that the name and description are accurately extracted based on the provided messages and wallet information.
Do not put json markdown block in response. Your message should be parseable via JSON.parse() function.
`;

export const generateNftItemImageTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

Generate a unique and artistic NFT image based on the following details:
Collection: {{collectionName}}
Token ID: {{tokenId}}
Description: {{description}}

The image should be visually appealing and reflect the NFT's characteristics and theme.
`;
