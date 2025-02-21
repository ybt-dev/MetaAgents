use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::Empty;
use crate::state::Metadata;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub name: String,
    pub symbol: String,
    pub minter: String,
}

impl From<InstantiateMsg> for cw721_base::InstantiateMsg {
    fn from(msg: InstantiateMsg) -> Self {
        cw721_base::InstantiateMsg {
            name: msg.name,
            symbol: msg.symbol,
            minter: msg.minter,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Mint {
        token_id: String,
        owner: String,
        token_uri: String,
        image_url: String,
        collection: String,
        description: String,
    },
    Extension {
        msg: cw721_base::ExecuteMsg<Metadata, Empty>,
    },
}

// Import query messages from cw721-base
pub type QueryMsg = cw721_base::QueryMsg<Empty>; 