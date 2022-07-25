# Weekend project 2
- [x] Complete the contracts
- Structure scripts to
  - [x] Deploy everything
  - [x] Interact with the ballot factory
  - [x] Query proposals for each ballot
  - [x] Operate scripts
- [X] Publish the project in Github
- [x] Run the scripts with a few set of proposals
  - [x] Play around with token balances
  - [x] cast votes
  - [x] delegate votes
  - [x] create Ballot from snapshot
  - [x] interact with the ballot
  - [x] inspect the results
- [x] Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step
- [ ] (Extra) Use TDD methodology

# Branches
Please be aware that we have different solutions implemented in different branches of the project, as everybody has been working on their own implementation. The following report's result stem from the output produced by the bill-branch. 

## Deploy Token Contract
* command
```shell 
ts-node scripts/deployTokenContract.ts 
```
* Output:
```
Deploying new token contract from 0xBD720874a79628D42BcCE5FCEBBF716239b561Ea...
Succesfully deployed token contract at 0x6F0cB9927b9324388DC1849a4B14Ca386856eEe6
```

* Etherscan Contract Address: 
https://ropsten.etherscan.io/address/0x6F0cB9927b9324388DC1849a4B14Ca386856eEe6

## Full Voting Process
* command
```shell 
ts-node scripts/fullVote.ts 
```
* Output:
```
Deploying new token contract from 0xBD720874a79628D42BcCE5FCEBBF716239b561Ea...
Succesfully deployed token contract at 0x81B4635e7452AFA55590582d16A9CB3ED19e8765
Minting tokens to 0xBD720874a79628D42BcCE5FCEBBF716239b561Ea...
Tokens successfully minted
Delegating all votes to 0xBD720874a79628D42BcCE5FCEBBF716239b561Ea...
Successfully delegated all votes to 0xBD720874a79628D42BcCE5FCEBBF716239b561Ea
Deploying new ballot contract from 0xBD720874a79628D42BcCE5FCEBBF716239b561Ea...
Succesfully deployed token contract at 0xafB0a62c1b9F648ce70EB7919a26617654130211
Waiting for 1 block...
Block 12661545 mined
Block 12661546 mined
Voting power: 100.0
Voting for proposal 1
Successfully voted for proposal 1 with 10.0 voting power
Voting power: 90.0
Voting for proposal 2
Successfully voted for proposal 2 with 50.0 voting power
Voting power: 40.0
Winning proposal Prop 2
```

* Etherscan Tx's
Token Contract: https://ropsten.etherscan.io/tx/0x81B4635e7452AFA55590582d16A9CB3ED19e8765
Token Contract: https://ropsten.etherscan.io/tx/0xafB0a62c1b9F648ce70EB7919a26617654130211
