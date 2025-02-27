module nft_collection::metaAgents_nft_module {
    use initia_std::string;
    use initia_std::option;
    use initia_std::signer;
    use initia_std::object;
    use initia_std::simple_nft;
    use initia_std::bigdecimal;
    use initia_std::vector;
    use initia_std::event;

    // Event structs
    #[event]
    struct CollectionCreatedEvent has drop, store {
        creator: address,
        name: string::String,
        description: string::String,
        max_supply: u64
    }

    #[event]
    struct NFTMintedEvent has drop, store {
        creator: address,
        collection_name: string::String,
        token_id: string::String,
        recipient: address
    }

    struct Collection has key {
        name: string::String,
        description: string::String,
        uri: string::String,
    }

    public entry fun create_collection(
        creator: &signer,
        name: string::String,
        description: string::String,
        uri: string::String,
        max_supply: u64,
        royalty_points: u64
    ) {
        let creator_address = signer::address_of(creator);
        let royalty_decimal = bigdecimal::from_ratio_u64(royalty_points, 100);
        
        simple_nft::create_collection(
            creator,
            description,
            option::some(max_supply),
            name,
            uri,
            true,  // mutable_description
            true,  // mutable_royalty
            true,  // mutable_uri
            true,  // mutable_nft_description
            true,  // mutable_nft_properties
            true,  // mutable_nft_uri
            royalty_decimal
        );

        event::emit(
            CollectionCreatedEvent {
                creator: creator_address,
                name,
                description,
                max_supply
            }
        );
    }

    public entry fun mint_nft(
        creator: &signer,
        collection_name: string::String,
        description: string::String,
        token_id: string::String,
        uri: string::String,
        to: address
    ) {
        let creator_address = signer::address_of(creator);

        simple_nft::mint(
            creator,
            collection_name,
            description,
            token_id,
            uri,
            vector::empty(), // property_keys
            vector::empty(), // property_types
            vector::empty(), // property_values
            option::some(to)
        );

        event::emit(
            NFTMintedEvent {
                creator: creator_address,
                collection_name,
                token_id,
                recipient: to
            }
        );
    }  
}