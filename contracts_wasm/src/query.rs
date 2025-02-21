use cosmwasm_std::{Deps, StdResult};
use cw721::TokensResponse;
use crate::contract::Cw721Contract;

pub fn query_tokens(
    deps: Deps,
    owner: String,
    _start_after: Option<String>,
    limit: Option<u32>,
) -> StdResult<TokensResponse> {
    let owner_addr = deps.api.addr_validate(&owner)?;
    let contract = Cw721Contract::default();
    let tokens = contract.tokens
        .keys(deps.storage, None, None, cosmwasm_std::Order::Ascending)
        .filter(|r| {
            if let Ok(token_id) = r {
                if let Ok(Some(token_info)) = contract.tokens.may_load(deps.storage, token_id) {
                    return token_info.owner == owner_addr;
                }
            }
            false
        })
        .take(limit.unwrap_or(30) as usize)
        .collect::<StdResult<Vec<_>>>()?;
    Ok(TokensResponse { tokens })
}