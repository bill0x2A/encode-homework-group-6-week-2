import { ethers } from "ethers";
import "dotenv/config";
// eslint-disable-next-line node/no-missing-import
import { checkBalance, saveDeploymentAddress, setupScripts } from "./helpers";
import { CustomBallot, MyToken } from "../typechain";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

export async function deployVoteTokenContract() {
  console.log("We're in deployment of VoteTokenContract ");
  const { signer, tokenJson } = await setupScripts();
  await checkBalance(signer);

  console.log("Deploying Token Contract");

  const tokenFactory = new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer
  );

  const tokenContract = await tokenFactory.deploy();

  console.log("Awaiting confirmations.");

  await tokenContract.deployed();

  console.log("Completed Token Contract deployment.");
  console.log(`Contract deployed at ${tokenContract.address}`);

  await saveDeploymentAddress(
    __dirname,
    "../artifacts/contracts/Token.sol/MyToken.json",
    tokenContract.address
  );

  console.log("Contract deployment address successfully saved to artifacts. ");

  return tokenContract as MyToken;
}

export async function deployNewBallotContract(
  proposals: string[],
  voteTokenAddress: string
) {
  console.log("We're in deployment of BallotContract ");
  const { signer, ballotJson } = await setupScripts();
  await checkBalance(signer);

  console.log("Deploying Ballot Contract");
  console.log("Proposals: ");

  proposals.forEach((element, index) => {
    console.log(`Proposal Nr. ${index + 1}: ${element}`);
  });

  const ballotFactory = new ethers.ContractFactory(
    ballotJson.abi,
    ballotJson.bytecode,
    signer
  );

  const proposalBytes = convertStringArrayToBytes32(proposals);

  const ballotContract = await ballotFactory.deploy(
    proposalBytes,
    voteTokenAddress
  );
  console.log("Awaiting confirmations");

  await ballotContract.deployed();

  console.log("Completed Ballot deployment");
  console.log(`Contract deployed at ${ballotContract.address}`);

  await saveDeploymentAddress(
    __dirname,
    "../artifacts/contracts/CustomBallot.sol/CustomBallot.json",
    ballotContract.address
  );

  console.log("Contract deploymnet address successfully saved to artifacts");

  return ballotContract as CustomBallot;
}

async function main() {
  console.log("We're in main");
  const myToken = await deployVoteTokenContract();
  const proposals = ["Proposal 1", "Proposal 2", "Proposal 3"];
  await deployNewBallotContract(proposals, myToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
