# Weekend project 2
- [ ] Complete the contracts
- Structure scripts to
  - [x] Deploy everything
  - [ ] Interact with the ballot factory
  - [ ] Query proposals for each ballot
  - [ ] Operate scripts
- [X] Publish the project in Github
- [ ] Run the scripts with a few set of proposals
  - [ ] Play around with token balances
  - [ ] cast votes
  - [ ] delegate votes
  - [ ] create Ballot from snapshot
  - [ ] interact with the ballot
  - [ ] inspect the results
- [ ] Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step
- [ ] (Extra) Use TDD methodology

## Deploying
### Command
```shell 
ts-node scripts/deployment.ts
```

### Output
```shell
Using address from 0xBD720874a79628D42BcCE5FCEBBF716239b561Ea
Wallet balance 0.9696216863570678
Deploying Token Contract
Awaiting confirmations.
Completed Token Contract deployment.
Contract deployed at 0x033994f64070d76dB87416BE4a9F6B648677A313
Contract deployment address successfully saved to artifacts. 
Using address from 0xBD720874a79628D42BcCE5FCEBBF716239b561Ea
Wallet balance 0.9634772438283937
Deploying Ballot Contract
Proposals: 
Proposal Nr. 1: Proposal 1
Proposal Nr. 2: Proposal 2
Proposal Nr. 3: Proposal 3
Awaiting confirmations
Completed Ballot deployment
Contract deployed at 0x475F818b7f63D09cC460e02985551e1b28f89426
Contract deploymnet address successfully saved to artifacts
```

### Addresses
MyToken Address: [0x033994f64070d76dB87416BE4a9F6B648677A313](https://ropsten.etherscan.io/address/0x033994f64070d76dB87416BE4a9F6B648677A313)
CustomBallot Address: [0x475F818b7f63D09cC460e02985551e1b28f89426](https://ropsten.etherscan.io/address/0x475F818b7f63D09cC460e02985551e1b28f89426)