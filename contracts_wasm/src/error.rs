use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Token already claimed")]
    Claimed {},

    #[error("Token not found")]
    TokenNotFound {},

    #[error("Base contract error: {0}")]
    Base(#[from] cw721_base::ContractError),
} 