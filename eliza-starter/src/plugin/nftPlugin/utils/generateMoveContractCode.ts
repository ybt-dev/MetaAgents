import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "child_process";

interface MoveContractConfig {
  packageName: string;
  name: string;
  symbol: string;
  description?: string;
  maxSupply: number;
}

export async function generateMoveContract(
  config: MoveContractConfig
): Promise<{
  code: string;
  path: string;
  packagePath: string;
}> {
  // Use contracts_move directory instead of generating contract
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const packageDir = path.join(currentDir, "../contract");

  // Contract already exists, just return paths
  return {
    code: fs.readFileSync(path.join(packageDir, "sources/nft.move"), "utf8"),
    path: path.join(packageDir, "sources/nft.move"),
    packagePath: packageDir,
  };
}

export async function compileMoveContract(packagePath: string): Promise<{
  compiled: boolean;
  output?: string;
  error?: string;
}> {
  try {
    // Check if build directory exists
    const buildDir = path.join(packagePath, "build");
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    // Compile using initiad move build
    const output = execSync(`initiad move build`, {
      encoding: "utf8",
      cwd: packagePath, // Execute in the package directory
    });

    return {
      compiled: true,
      output,
    };
  } catch (error) {
    console.error("Error compiling Move contract:", error);
    return {
      compiled: false,
      error: error.message,
    };
  }
}

async function queryTxWithRetries(
  txHash: string,
  maxRetries = 10,
  retryDelay = 2000
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempting to query tx (attempt ${i + 1}/${maxRetries})...`);
      const txInfoCommand = `initiad query tx ${txHash} --node https://rpc.testnet.initia.xyz:443 -o json`;
      const txInfoOutput = execSync(txInfoCommand, { encoding: "utf8" });
      return JSON.parse(txInfoOutput);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(
        `Transaction not found yet, waiting ${retryDelay / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw new Error("Max retries reached while querying transaction");
}

export async function publishMoveContract(
  packagePath: string,
  wallet: string,
  passphrase: string
): Promise<{
  success: boolean;
  packageId?: string;
  output?: string;
  error?: string;
}> {
  try {
    const command = `echo "${passphrase}" | initiad move deploy \
      --from ${wallet} \
      --node https://rpc.testnet.initia.xyz:443 \
      --chain-id initiation-2 \
      --gas auto \
      --gas-prices 0.015uinit \
      -o json \
      -y`;

    const output = execSync(command, {
      encoding: "utf8",
      cwd: packagePath,
    });

    console.log("Raw deployment output:", output);

    let result;
    try {
      result = JSON.parse(output);
      console.log("Parsed result:", JSON.stringify(result, null, 2));
    } catch (parseError) {
      return {
        success: false,
        error: "Failed to parse deployment output",
        output,
      };
    }

    // Get the transaction hash
    const txHash = result.txhash;
    if (!txHash) {
      return {
        success: false,
        error: "Could not find transaction hash in output",
        output: JSON.stringify(result, null, 2),
      };
    }

    console.log("Transaction hash:", txHash);
    console.log("Waiting for transaction to be included in a block...");

    // Query transaction with retries
    const txInfo = await queryTxWithRetries(txHash);
    console.log("Transaction info:", JSON.stringify(txInfo, null, 2));

    // Find the ModulePublishedEvent in the events
    const modulePublishedEvent = txInfo.events?.find(
      (e) =>
        e.type === "move" &&
        e.attributes?.find((a) => a.key === "type_tag")?.value ===
          "0x1::code::ModulePublishedEvent"
    );

    if (modulePublishedEvent) {
      const dataAttribute = modulePublishedEvent.attributes.find(
        (a) => a.key === "data"
      );
      if (dataAttribute) {
        const eventData = JSON.parse(dataAttribute.value);
        const moduleId = eventData.module_id;
        if (moduleId) {
          return {
            success: true,
            packageId: moduleId,
            output: JSON.stringify(txInfo, null, 2),
          };
        }
      }
    }

    return {
      success: false,
      error: "Could not find package ID in transaction info",
      output: JSON.stringify(txInfo, null, 2),
    };
  } catch (error) {
    console.error("Error publishing Move contract:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getContractABI(
  packageId: string,
  moduleName: string
): Promise<any> {
  try {
    const output = execSync(
      `initiad query move module ${packageId} ${moduleName} --node https://rpc.testnet.initia.xyz`,
      { encoding: "utf8" }
    );

    // Parse the output to get module interface
    const result = JSON.parse(output);

    // The ABI is stored as a JSON string within the module.abi field
    const abiData = JSON.parse(result.module.abi);

    return {
      abi: abiData,
      address: result.module.address,
      moduleName: result.module.module_name,
      upgradePolicy: result.module.upgrade_policy,
    };
  } catch (error) {
    console.error("Error getting contract ABI:", error);
    throw error;
  }
}

interface MintNFTParams {
  collectionName: string;
  name: string;
  description: string;
  imageUrl: string;
  contentBytes: string;
  amount: number;
}

export async function mintNFT(
  packageId: string,
  params: MintNFTParams,
  wallet: string,
  passphrase: string
): Promise<{
  success: boolean;
  nftId?: string;
  transactionId?: string;
  error?: string;
}> {
  try {
    const [moduleAddress, moduleName] = packageId.split("::");

    // Format the content bytes
    const formattedContentBytes = params.contentBytes.startsWith("0x")
      ? params.contentBytes.slice(2)
      : params.contentBytes;

    const command = `echo "${passphrase}" | initiad tx move execute \
      ${moduleAddress} \
      ${moduleName} \
      create_nft \
      --args '["string:${params.collectionName}","string:${params.name}","string:${params.description}","string:${params.imageUrl}","vector<u8>:${formattedContentBytes}","u64:${params.amount}"]' \
      --from ${wallet} \
      --gas auto \
      --gas-adjustment 1.5 \
      --gas-prices 0.015uinit \
      --node https://rpc.testnet.initia.xyz \
      --chain-id initiation-2 \
      -o json \
      -y`;

    const output = execSync(command, {
      encoding: "utf8",
    });

    const result = JSON.parse(output);
    const txId = result.txhash;
    const nftId = result.nft_id;

    if (!txId) {
      return {
        success: false,
        error: "Could not find transaction ID in output",
      };
    }

    return {
      success: true,
      nftId,
      transactionId: txId,
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getNFTInfo(nftId: string): Promise<any> {
  try {
    const output = execSync(
      `initiad query move object ${nftId} --node https://rpc.testnet.initia.xyz`,
      { encoding: "utf8" }
    );

    const result = JSON.parse(output);

    // Log raw output for debugging
    console.log("Raw NFT Info Output:", output);

    return result;
  } catch (error) {
    console.error("Error getting NFT info:", error);
    if (error instanceof Error) {
      console.error("Raw output:", error.message);
    }
    throw error;
  }
}

export async function getTransactionInfo(transactionId: string): Promise<any> {
  try {
    const output = execSync(
      `initiad query tx ${transactionId} --node https://rpc.testnet.initia.xyz`,
      { encoding: "utf8" }
    );

    return JSON.parse(output);
  } catch (error) {
    console.error("Error getting transaction info:", error);
    throw error;
  }
}

interface CreateCollectionParams {
  packageId: string;
  name: string;
  description: string;
  uri: string;
  maxSupply: number;
  wallet: string;
}

export async function createCollection(
  params: CreateCollectionParams & { passphrase: string }
): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
  collectionId?: string;
}> {
  try {
    // Split the packageId into address and module name
    const [moduleAddress, moduleName] = params.packageId.split("::");

    // Update the argument order to match the Move contract
    const command = `echo "${params.passphrase}" | initiad tx move execute \
      ${moduleAddress} \
      ${moduleName} \
      create_collection \
      --args '["string:${params.name}","string:${params.description}","string:${params.uri}","u64:${params.maxSupply}"]' \
      --from ${params.wallet} \
      --gas auto \
      --gas-adjustment 1.5 \
      --gas-prices 0.015uinit \
      --node https://rpc.testnet.initia.xyz \
      --chain-id initiation-2 \
      -o json \
      -y`;

    const output = execSync(command, {
      encoding: "utf8",
    });

    const result = JSON.parse(output);
    const txId = result.txhash;
    const collectionId = result.collection_id;

    if (!txId) {
      return {
        success: false,
        error: "Could not find transaction ID in output",
      };
    }

    return {
      success: true,
      transactionId: txId,
      collectionId,
    };
  } catch (error) {
    console.error("Error creating collection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
