import { ethers } from "ethers";
export const PROPOSALS = ["Prop1 ", "Prop 2", "Prop 3"];
export const PROPOSALS_BYTES = PROPOSALS.map((proposal) =>
  ethers.utils.formatBytes32String(proposal)
);
export const MINT_QUANTITY = ethers.utils.parseEther("100");
