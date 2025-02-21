module nft_collection::nft_12 {
    use std::signer;
    use std::string::String;
    use std::vector;
    use std::option::{Self, Option};
    use std::guid;
    use std::event;

    // ====== Resources ======
    struct Collection has key, store {
        name: String,
        description: String,
        uri: String,
        max_supply: u64,
        total_minted: u64,
        tokens: vector<TokenData>
    }

    struct Token has key, store {
        id: guid::ID,
        balance: u64,
        token_data: Option<TokenData>,
        collection_creator: address,
        collection_name: String
    }

    struct TokenData has store {
        metadata: NFTMetadata,
        token_id: guid::GUID,
        content_uri: vector<u8>,
        supply: u64
    }

    struct NFTMetadata has copy, store, drop {
        name: String,
        description: String,
        image_url: String
    }

    // Add event structs at the module level
    #[event]
    struct CollectionCreatedEvent has drop, store {
        creator: address,
        name: String,
        max_supply: u64
    }

    #[event]
    struct NFTMintedEvent has drop, store {
        creator: address,
        collection_name: String,
        token_name: String,
        amount: u64
    }

    // ====== Error Constants ======
    const ECOLLECTION_ALREADY_EXISTS: u64 = 1;
    const ECOLLECTION_NOT_FOUND: u64 = 2;
    const ECOLLECTION_SUPPLY_EXCEEDED: u64 = 3;
    const ENFT_NOT_FOUND: u64 = 4;
    const EMAX_SUPPLY_REACHED: u64 = 5;

    // ====== Public Functions ======
    public entry fun create_collection(
        creator: &signer,
        name: String,
        description: String,
        uri: String,
        max_supply: u64
    ) {
        let creator_addr = signer::address_of(creator);
        assert!(!exists<Collection>(creator_addr), ECOLLECTION_ALREADY_EXISTS);

        let collection = Collection {
            name,
            description,
            uri,
            max_supply,
            total_minted: 0,
            tokens: vector::empty()
        };

        // Emit collection created event
        event::emit(CollectionCreatedEvent {
            creator: creator_addr,
            name: *&name,
            max_supply
        });

        move_to(creator, collection);
    }

    public entry fun create_nft(
        creator: &signer,
        collection_name: String,
        name: String,
        description: String,
        image_url: String,
        content_uri: vector<u8>,
        amount: u64
    ) acquires Collection {
        let creator_addr = signer::address_of(creator);
        assert!(exists<Collection>(creator_addr), ECOLLECTION_NOT_FOUND);
        
        let collection = borrow_global_mut<Collection>(creator_addr);
        assert!(collection.total_minted + amount <= collection.max_supply, ECOLLECTION_SUPPLY_EXCEEDED);

        let metadata = NFTMetadata {
            name,
            description,
            image_url
        };

        let guid = guid::create(creator);
        let id = guid::id(&guid);
        let token_data = TokenData {
            metadata,
            token_id: guid,
            content_uri,
            supply: amount
        };

        let token = Token {
            id,
            balance: amount,
            token_data: option::some(token_data),
            collection_creator: creator_addr,
            collection_name
        };

        collection.total_minted = collection.total_minted + amount;

        // Emit NFT minted event
        event::emit(NFTMintedEvent {
            creator: creator_addr,
            collection_name: *&collection_name,
            token_name: *&name,
            amount
        });

        move_to(creator, token);
    }

    public fun get_collection_info(creator: address): (String, String, u64, u64) acquires Collection {
        let collection = borrow_global<Collection>(creator);
        (
            *&collection.name,
            *&collection.description,
            collection.max_supply,
            collection.total_minted
        )
    }
} 