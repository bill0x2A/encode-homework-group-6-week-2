import { ethers } from "ethers";
import { CustomBallot } from "../typechain";
const path = require("path");
const fs = require("fs");

class ImportError extends Error {}

export { deployNewContract } from "./CustomBallot/deploy";

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
    "../artifacts/contracts/CustomBallot.sol/CustomBallot.json" //Question - what exactly is happening here?
  );

  const tokenJson: ethers.Contract = await loadJson(
    __dirname,
    "../artifacts/contracts/Token.sol/MyToken.json" //Question - what exactly is happening here?
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
  console.log(`Using address ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten", {
    infura: {
      projectId: process.env.INFURA_PROJECT_ID,
      projectSecret: process.env.INFURA_PROJECT_SECRET,
    },
  });
  const signer = wallet.connect(provider);

  let customBallotContract;
  if (ballotJson.address) {
    customBallotContract = new ethers.Contract(
      contractAddress || ballotJson.address,
      ballotJson.abi,
      signer
    );
  }
  customBallotContract = customBallotContract as CustomBallot;

  //token
  let tokenContract;
  if (tokenJson.address) {
    tokenContract = new ethers.Contract(
      contractAddress || tokenJson.address,
      tokenJson.abi,
      signer
    );
  }
  tokenContract = tokenContract as CustomBallot;
  return {
    ballotJson,
    customBallotContract,
    tokenJson,
    tokenContract,
    wallet,
    provider,
    signer,
  };
};

export const checkBalance = async (signer: ethers.Signer): Promise<void> => {// Question - What is the Promise in the paramter?
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
};
