import { BytesLike, ethers } from "ethers";
// eslint-disable-next-line node/no-missing-import
import { CustomBallot, MyToken } from "../typechain";
// eslint-disable-next-line node/no-missing-import
import { loadJson, getSigner } from "./helpers";

class DeploymentError extends Error { }

export const deployNewTokenContract = async () => {
  const tokenJson = await loadJson(
    __dirname,
    "../artifacts/contracts/Token.sol/MyToken.json"
  );

  const signer = getSigner();

  const tokenContractFactory = new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer
  );

  let tokenContract;
  try {
    console.log(`Deploying new token contract from ${signer.address}...`);
    tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployed();
    console.log(
      `Succesfully deployed token contract at ${tokenContract.address}`
    );
  } catch (e) {
    console.log(e);
    throw new DeploymentError("Token contract failed to deploy");
  }

  return tokenContract as MyToken;
};

export const deployNewBallotContract = async (
  proposals: Array<BytesLike>,
  tokenAddress: string
) => {
  const ballotJson = await loadJson(
    __dirname,
    "../artifacts/contracts/CustomBallot.sol/CustomBallot.json"
  );

  const signer = getSigner();

  const ballotContractFactory = new ethers.ContractFactory(
    ballotJson.abi,
    ballotJson.bytecode,
    signer
  );

  let ballotContract;
  try {
    ballotContract = await ballotContractFactory.deploy(
      proposals,
      tokenAddress
    );
    await ballotContract.deployed();
  } catch (e) {
    console.log(e);
    throw new DeploymentError("Ballot contract failed to deploy");
  }

  return ballotContract as CustomBallot;
};
