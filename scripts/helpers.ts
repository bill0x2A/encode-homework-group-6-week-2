import "dotenv/config";
import { ethers } from "ethers";
const path = require("path");
const fs = require("fs");

class ImportError extends Error { }

export const loadJson = async (baseDirectory: string, jsonPath: string) => {
  try {
    const resolvedPath: string = path.resolve(baseDirectory, jsonPath);
    return await require(resolvedPath);
  } catch (e) {
    throw new ImportError(
      `Unable to import module ${jsonPath}, check the path exits (have you compiled the contracts?)`
    );
  }
};

export const saveDeploymentAddress = async (
  baseDirectory: string,
  jsonPath: string,
  address: string
) => {
  try {
    const artifact = await loadJson(baseDirectory, jsonPath);
    const deploymentArtifactPath = path.resolve(baseDirectory, jsonPath);
    fs.writeFile(
      deploymentArtifactPath,
      JSON.stringify({ ...artifact, address }),
      (err: string) => {
        if (err) {
          throw new Error(err);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

export const checkBalance = async (
  signer: ethers.Signer | ethers.Wallet
): Promise<void> => {
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
};

export const getSigner = () => {
  if (!(process.env.MNEMONIC || process.env.PRIVATE_KEY)) {
    throw new Error(
      "Please add a MNEMONIC or PRIVATE_KEY to your .env file at the root of the project"
    );
  }

  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY as ethers.BytesLike);

  const provider = ethers.providers.getDefaultProvider("ropsten", {
    infura: {
      projectId: process.env.INFURA_PROJECT_ID,
      projectSecret: process.env.INFURA_PROJECT_SECRET,
    },
  });
  return wallet.connect(provider);
};

export const waitForBlocks = async (blocks: number) => {
  console.log(`Waiting for ${blocks} block${blocks === 1 ? "" : "s"}...`);
  const provider = getSigner().provider;
  const startingBlockNumber = await provider.getBlockNumber();
  return new Promise<void>((resolve) => {
    provider.on("block", (blockNumber) => {
      console.log(`Block ${blockNumber} mined`);
      if (blockNumber >= startingBlockNumber + blocks) {
        provider.off("block");
        resolve();
      }
    });
  });
};
