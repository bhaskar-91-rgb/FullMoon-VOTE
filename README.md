# fullMoon — Private Voting on Midnight

![CI](https://github.com/bhaskar-91-rgb/FullMoon-VOTE/actions/workflows/ci.yml/badge.svg)

> A decentralized, privacy-preserving governance platform built on the Midnight Network.

## Live Demo
https://full-moon-vote-frontend.vercel.app/

## Demo Video
🎥 [Watch the 1-Minute Walkthrough Video (Google Drive)](https://drive.google.com/file/d/13jqOPgF_4UJsbL_pL8PsCl0TxIu56icn/view?usp=sharing)

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | `332fb482e52e939bbc63a6a6b5094587d059054cfcbd36198605dff12bcce450` |

- 🔍 **Contract on Midnight Explorer:** [View Preprod Contract](https://preprod.midnightexplorer.com/contracts/332fb482e52e939bbc63a6a6b5094587d059054cfcbd36198605dff12bcce450)

## Live On-Chain Transaction
- 🧾 **openElection Transaction (Midnight Preprod):** [View on 1AM Explorer](https://explorer.1am.xyz/tx/94fe122a915fab186426354aa4eb58280496ec15f5f268ac3ae89df443f17ee1?network=preprod)

## Screenshots

**Product UI — fullMoon voting dashboard with Glassmorphism design:**
![Product UI](screenshots/product%20ui.png)

**Contract Deployed On-Chain — verified on Midnight Preprod Explorer:**
![Contract On Chain](screenshots/contract%20on%20chain.png)

**Successful Transaction — openElection ZK proof submitted on Preprod:**
![Transaction Success](screenshots/transaction%20sucess.png)

**Test Output — all 23 tests passing (circuit logic, state transitions, privacy):**
![Test Output](screenshots/test%20output.png)

## What This Does
fullMoon is a fully private on-chain voting application. It allows authorized participants to cast votes on proposals without revealing their choices to the public ledger. The system uses zero-knowledge proofs to guarantee the integrity of the election: only valid voters can vote, double-voting is prevented, and the final tally accurately reflects the cast votes, all while keeping individual voter choices completely confidential.

## Privacy Model
- **PUBLIC:** The existence of the election, the contract address, the total yes/no tallies, the total turnout, and the list of nullifiers (which prevent double voting).
- **PRIVATE:** The voter's identity (secret key) and the voter's specific choice (YES or NO) for any given ballot.
- **PROVED without revealing:** The voter proves they possess a valid, authorized secret key and that they haven't voted yet (by generating a unique nullifier), and they update the correct public tally based on their private choice, all without ever revealing the secret key or the choice itself to the network.

## Privacy Claim
An on-chain observer analyzing the ledger can see that transactions are occurring and can observe the aggregate YES/NO tallies updating over time. They can also see unique nullifiers being appended to the state. However, the observer **cannot** link any specific nullifier or transaction to a particular voter, nor can they determine whether a specific transaction was a YES or NO vote. The anonymity set encompasses all authorized voters, ensuring complete ballot secrecy.

## Tech Stack
- **Smart Contract:** Compact (Midnight's ZK-focused language)
- **Frontend Framework:** React 18, Vite
- **Styling:** Tailwind CSS
- **Blockchain Integration:** `@midnight-ntwrk/midnight-js-contracts` and related SDKs
- **Tooling:** TypeScript, Vitest

## Prerequisites
- Node.js (v20 or v22 recommended)
- `npm` package manager
- Midnight Lace Wallet (Lace 1AM) installed in your browser

## Setup & Run Locally

1. Clone the repository and install dependencies:
```bash
npm install
```

2. To run the frontend development server:
```bash
npm run dev --workspace frontend
```
The application will be available at `http://localhost:5173`.

## Run Tests
To execute the test suite (which covers circuit logic, state transitions, and privacy):
```bash
npm run test:ci --workspace frontend
```

## CI/CD
The GitHub Actions pipeline (`.github/workflows/ci.yml`) runs automatically on every push and pull request. It executes the following steps:
1. **Contract Compilation**: Installs the Compact toolchain and compiles the smart contract to ensure there are no syntax or type errors in the ZK circuits.
2. **Frontend Validation**: Sets up Node.js, installs all dependencies, runs the ESLint linter, executes the full Vitest test suite, and finally builds the production bundle to verify that the application compiles without errors.

## Product Proposal
See `PROPOSAL.md` for details regarding the product use cases, data model, and feasibility for Mainnet.
