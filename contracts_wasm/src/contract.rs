#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Empty};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::Metadata;

// version info for migration
const CONTRACT_NAME: &str = "crates.io:nft-contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

// This makes a custom NFT implementation based on cw721-base
pub type Extension = Metadata;
pub type Cw721Contract<'a> = cw721_base::Cw721Contract<'a, Extension, Empty, Empty, Empty>;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    // Create the contract with cw721-base
    let cw721_msg: cw721_base::InstantiateMsg = msg.into();
    Cw721Contract::default().instantiate(deps, env, info, cw721_msg)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Mint {
            token_id,
            owner,
            token_uri,
            image_url,
            collection,
            description,
        } => execute_mint(
            deps,
            env,
            info,
            token_id,
            owner,
            token_uri,
            image_url,
            collection,
            description,
        ),
        ExecuteMsg::Extension { msg } => Cw721Contract::default()
            .execute(deps, env, info, msg)
            .map_err(ContractError::Base),
    }
}

pub fn execute_mint(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    token_id: String,
    owner: String,
    token_uri: String,
    image_url: String,
    collection: String,
    description: String,
) -> Result<Response, ContractError> {
    let owner_addr = deps.api.addr_validate(&owner)?;
    
    // Create the token metadata
    let token = Metadata {
        image_url,
        token_uri,
        collection,
        description,
    };

    let mint_msg = cw721_base::MintMsg {
        token_id: token_id.clone(),
        owner: owner_addr.to_string(),
        token_uri: None,
        extension: token,
    };

    Cw721Contract::default().mint(
        deps,
        env,
        info,
        mint_msg,
    )?;

    Ok(Response::new()
        .add_attribute("action", "mint")
        .add_attribute("token_id", token_id))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    // Forward all queries to base cw721 implementation
    Cw721Contract::default().query(deps, env, msg)
} 