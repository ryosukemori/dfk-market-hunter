# DFK Market Hunter

An automated hero sniping bot for the DeFi Kingdoms (DFK) marketplace on the Harmony ONE network. This bot monitors the hero auction marketplace in real-time and automatically purchases heroes that meet specific price criteria.

## Features

- Real-time auction monitoring via pending transaction scanning
- Automatic bidding on underpriced heroes
- Special handling for Gen0 heroes (ID <= 2071) with separate price threshold
- Configurable price thresholds for different hero types
- Gas price optimization with configurable boost multiplier
- Duplicate bid prevention
- Detailed logging of all bid attempts and results

## Prerequisites

- Node.js (v14 or higher)
- Yarn or npm
- A Harmony ONE wallet with JEWEL tokens for bidding
- RPC endpoint access to Harmony network

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd dfk-market-hunter

# Install dependencies
yarn install
# or
npm install
```

## Configuration

Create a `.env` file in the root directory with the following environment variables:

```env
# Required
PK=your_private_key_here
RPC=https://api.harmony.one

# Optional
RPC_WSS=wss://ws.api.harmony.one
PROVIDER=http
bidPrice=15
bidPriceGen0=200
GAS_BOOST=10
GAS_LIMIT=500000
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PK` | Yes | - | Private key for your Harmony wallet |
| `RPC` | Yes | - | HTTP RPC endpoint URL |
| `RPC_WSS` | No | `''` | WebSocket RPC endpoint (optional) |
| `PROVIDER` | No | `'http'` | Provider mode (`http` or `wss`) |
| `bidPrice` | No | `15` | Maximum price (in JEWEL) to auto-bid on regular heroes |
| `bidPriceGen0` | No | `200` | Maximum price (in JEWEL) to auto-bid on Gen0 heroes |
| `GAS_BOOST` | No | `10` | Gas price multiplier for faster transactions |
| `GAS_LIMIT` | No | `500000` | Maximum gas limit per transaction |

## Usage

### Start the Bot

```bash
yarn start
# or
npm start
```

### Development Mode

```bash
yarn dev
# or
npm run dev
```

### Build

```bash
yarn build
# or
npm run build
```

## How It Works

1. The bot connects to the Harmony network via the configured RPC endpoint
2. Monitors pending transactions for `createAuction` function calls
3. When a new hero is listed for auction, the bot checks:
   - If the hero is Gen0 (ID <= 2071), compares price against `bidPriceGen0`
   - Otherwise, compares price against `bidPrice`
4. If the price is below the threshold, the bot automatically places a bid
5. Uses optimized gas settings to ensure transaction confirmation
6. Logs all bid attempts and results to `bid.log`

## Project Structure

```
dfk-market-hunter/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app/
│   │   ├── marketHunter.ts     # V1 market hunter
│   │   └── marketHunterV2.ts   # V2 market hunter (active)
│   ├── contracts/dfk/
│   │   ├── auction.ts          # Auction contract interactions
│   │   └── hero.ts             # Hero contract interactions
│   ├── tokens/
│   │   ├── dfk.ts              # DFK-specific tokens
│   │   └── erc20.ts            # Generic ERC20 utilities
│   ├── util/
│   │   └── performance.ts      # Performance utilities
│   └── wallet/
│       └── index.ts            # Wallet management
├── package.json
├── tsconfig.json
└── .env                        # Your configuration (not in repo)
```

## Key Contract Addresses

| Contract | Address |
|----------|---------|
| Hero Auction | `0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892` |
| Hero NFT | `0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c` |
| JEWEL Token | `0x72cb10c6bfa5624dd07ef608027e366bd690048f` |

## Disclaimer

This bot is provided as-is for educational and personal use. Use at your own risk. The authors are not responsible for any losses incurred while using this software. Always ensure you understand the risks involved in automated trading and only use funds you can afford to lose. This is not financial advice.

## License

MIT
