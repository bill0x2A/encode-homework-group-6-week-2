import { ethers } from "ethers";
import "dotenv/config";
// eslint-disable-next-line node/no-missing-import
import { getSigner, deployNewBallotContract, waitForBlocks } from "./helpers";
import { deployVoteTokenContract } from "./deployment";
import { MyToken, CustomBallot } from "../typechain";

export async function mintToken(address: String, tokenContract: MyToken) {
  console.log("We're in mintToken");
  try {
    console.log(`Minting tokens to ${address}`);
    const mintTx = await tokenContract.mint(tokenContract.address, 100);
    console.log(`Tokens successfully minted in tx ${mintTx}`);
  } catch (e) {
    console.log("Minting failed. ");
    console.log(e);
  }
}

export async function delegateVotes(delegator: string, tokenContract: MyToken) {
  try {
    console.log(`Delegating all votes to ${delegator}`);
    const delegateTx = await tokenContract.delegate(delegator);
    await delegateTx.wait();
    console.log(`Successfully delegated all votes to ${delegator}`);
  } catch (e) {
    console.log("Delegation failed");
    console.log(e);
  }
}

export async function voteForProposal(ballotContract: CustomBallot) {
  console.log("Voting for proposal 2");
  try {
    const votesToCast = 10;
    const secondVoteTx = await ballotContract.vote(1, votesToCast);
    await secondVoteTx.wait();
    console.log(
      `Successfully votes for proposal 2 with ${ethers.utils.formatEther(
        votesToCast
      )} voting power`
    );
  } catch (e) {
    console.log("Vote for proposal 2 has failed. ");
    console.log(e);
  }
}

export async function winningProposal(ballotContract: CustomBallot) {
  const winnerName = await ballotContract.winnerName();
  console.log(
    `Winning proposal ${ethers.utils.parseBytes32String(winnerName)}`
  );
}

async function main() {
  console.log("We're in main");
  const delegator = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
  const proposals = ["Proposal 1", "Proposal 2", "Proposal 3"];

  const { address } = getSigner();
  console.log(`Got address ${address}`);
  const tokenContract = await deployVoteTokenContract();
  console.log("Deployed VoteTokenContract");
  await mintToken(address, tokenContract);
  await delegateVotes(delegator, tokenContract);
  const ballotContract = await deployNewBallotContract(
    proposals,
    tokenContract.address
  );
  await waitForBlocks(1);

  try {
    const votingPower = await ballotContract.votingPower();
    console.log(`Voting Power: ${ethers.utils.formatEther(votingPower)}`);
  } catch (e) {
    console.log(e);
  }

  await voteForProposal(ballotContract);

  try {
    const votingPower = await ballotContract.votingPower();
    console.log(`Voting Power: ${ethers.utils.formatEther(votingPower)}`);
  } catch (e) {
    console.log(e);
  }

  await winningProposal(ballotContract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
