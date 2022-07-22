/* eslint-disable node/no-missing-import */
import { ethers } from "ethers";
import { getSigner, waitForBlocks } from "./helpers";
import { deployNewTokenContract, deployNewBallotContract } from "./deployment";
import { MINT_QUANTITY, PROPOSALS_BYTES } from "./constants";

const main = async () => {
  const { address } = getSigner();
  const tokenContract = await deployNewTokenContract();
  try {
    console.log(`Minting tokens to ${address}...`);
    const mintTx = await tokenContract.mint(address, MINT_QUANTITY);
    await mintTx.wait();
    console.log("Tokens successfully minted");
  } catch (e) {
    console.log("Minting failed");
    console.log(e);
  }

  try {
    console.log(`Delegating all votes to ${address}...`);
    const delegateTx = await tokenContract.delegate(address);
    await delegateTx.wait();
    console.log(`Successfully delegated all votes to ${address}`);
  } catch (e) {
    console.log("Delegation failed");
    console.log(e);
  }

  const ballotContract = await deployNewBallotContract(
    PROPOSALS_BYTES,
    tokenContract.address
  );

  await waitForBlocks(1);

  try {
    const votingPower = await ballotContract.votingPower();
    console.log(`Voting power: ${ethers.utils.formatEther(votingPower)}`);
  } catch (e) {
    console.log(e);
  }

  try {
    console.log("Voting for proposal 1");
    const votesToCast = MINT_QUANTITY.div(10);
    const firstVoteTx = await ballotContract.vote(0, votesToCast);
    await firstVoteTx.wait();
    console.log(
      `Successfully voted for proposal 1 with ${ethers.utils.formatEther(
        votesToCast
      )} voting power`
    );
  } catch (e) {
    console.log("Vote for proposal 1 failed");
    console.log(e);
  }

  try {
    const votingPower = await ballotContract.votingPower();
    console.log(`Voting power: ${ethers.utils.formatEther(votingPower)}`);
  } catch (e) {
    console.log(e);
  }

  try {
    console.log("Voting for proposal 2");
    const votesToCast = MINT_QUANTITY.div(2);
    const secondVoteTx = await ballotContract.vote(1, votesToCast);
    await secondVoteTx.wait();
    console.log(
      `Successfully voted for proposal 2 with ${ethers.utils.formatEther(
        votesToCast
      )} voting power`
    );
  } catch (e) {
    console.log("Vote for proposal 2 failed");
    console.log(e);
  }

  try {
    const votingPower = await ballotContract.votingPower();
    console.log(`Voting power: ${ethers.utils.formatEther(votingPower)}`);
  } catch (e) {
    console.log(e);
  }

  const winnerName = await ballotContract.winnerName();
  console.log(
    `Winning proposal ${ethers.utils.parseBytes32String(winnerName)}`
  );
};

main().catch((e) => {
  console.log(e);
});
