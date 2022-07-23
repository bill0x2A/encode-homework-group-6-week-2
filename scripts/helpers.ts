import { ethers } from "ethers";
// eslint-disable-next-line node/no-missing-import
import { CustomBallot, MyToken } from "../typechain";
const path = require("path");
const fs = require("fs");

class ImportError extends Error {}

// eslint-disable-next-line node/no-missing-import
export { deployNewBallotContract } from "./deployment";

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

export const setupScripts = async (contractAddress?: string) => {
  const ballotJson: ethers.Contract = await loadJson(
    __dirname,
    "../artifacts/contracts/CustomBallot.sol/CustomBallot.json"
  );

  const tokenJson: ethers.Contract = await loadJson(
    __dirname,
    "../artifacts/contracts/Token.sol/MyToken.json"
  );

  if (!(process.env.MNEMONIC || process.env.PRIVATE_KEY)) {
    throw new Error(
      "Please add a MNEMONIC or PRIVATE_KEY to your .env file at the root of the project"
    );
  }

  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY as ethers.BytesLike);
  console.log(`Using address from ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten", {
    infura: {
      projectId: process.env.INFURA_PROJECT_ID,
      projectSecret: process.env.INFURA_PROJECT_SECRET,
    },
  });

  const signer = wallet.connect(provider);

  let ballotContract;
  if (ballotJson.address) {
    ballotContract = new ethers.Contract(
      contractAddress || ballotJson.address,
      ballotJson.abi,
      signer
    );
  }

  ballotContract = ballotContract as CustomBallot;

  let tokenContract;
  if (tokenJson.address) {
    tokenContract = new ethers.Contract(
      contractAddress || tokenJson.address,
      tokenJson.abi,
      signer
    );
  }

  tokenContract = tokenContract as MyToken;

  return {
    ballotJson,
    ballotContract,
    tokenJson,
    tokenContract,
    wallet,
    provider,
    signer,
  };
};

export const checkBalance = async (signer: ethers.Signer): Promise<void> => {
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
};
