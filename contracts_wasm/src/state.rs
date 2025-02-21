use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Metadata {
    pub image_url: String,
    pub token_uri: String,
    pub collection: String,
    pub description: String,
} 