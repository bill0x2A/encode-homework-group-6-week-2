import { ethers } from "ethers";
import "dotenv/config";
import { checkBalance, saveDeploymentAddress, setupScripts } from "../helpers";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

export async function deployNewContract(
  proposals = ["Proposal 1", "Proposal 2", "Proposal 3"]
) {
  if(process.argv.length < 3) throw new Error("Vote token address is missing")
  const voteTokenAddress = process.argv[2];
  const { signer, ballotJson } = await setupScripts();
  await checkBalance(signer);

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");

  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const ballotFactory = new ethers.ContractFactory(
    ballotJson.abi, //Question - Abi? 
    ballotJson.bytecode,
    signer
  );

  const customBallotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    voteTokenAddress
  );
  console.log("Awaiting confirmations");

  await customBallotContract.deployed();

  console.log("Completed");
  console.log(`Contract deployed at ${customBallotContract.address}`);

  await saveDeploymentAddress(
    __dirname,
    "../../artifacts/contracts/CustomBallot.sol/CustomBallot.json",
    customBallotContract.address
  );

  console.log("Contract deployment address succesfully saved to artifacts");

  return customBallotContract.address;
}

async function main() {
  await deployNewContract();
}

main().catch((error) => { 
  console.error(error);
  process.exitCode = 1;
});
