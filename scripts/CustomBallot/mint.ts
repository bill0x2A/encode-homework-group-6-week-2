//mint your TOKENs
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

export async function deployNewContract() {
  const { signer, tokenJson } = await setupScripts();
  await checkBalance(signer);

  console.log("Deploying Token contract");

  const tokenFactory = new ethers.ContractFactory(
    tokenJson.abi, 
    tokenJson.bytecode,
    signer
  );

  const tokenContract = await tokenFactory.deploy();
  console.log("Awaiting confirmations");

  await tokenContract.deployed();

  console.log("Completed");
  console.log(`Token Contract deployed at ${tokenContract.address}`);

  await saveDeploymentAddress(
    __dirname,
    "../../artifacts/contracts/Token.sol/MyToken.json",
    tokenContract.address
  );

  console.log("Token Contract deployment address succesfully saved to artifacts");

  return tokenContract.address;
}

async function main() {
  await deployNewContract();
}

main().catch((error) => { 
  console.error(error);
  process.exitCode = 1;
});
