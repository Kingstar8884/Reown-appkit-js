import { bsc, mainnet, polygon, base, solana, sepolia, bscTestnet } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

const projectId = "7cf68df23ef09d9a041b9e21530e2da1";


const BSC_TESTNET = {
  id: "eip155:97",           // CAIP chain ID for BSC Testnet
  namespace: "eip155",       // Ethereum-style chain
  chainId: "0x61",           // Hexadecimal chain ID (97 decimal)
  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  displayName: "BSC Testnet",
  ticker: "tBNB",
  tickerName: "Test BNB"
};



export const appKit = createAppKit({
  projectId,
  adapters: [new EthersAdapter()],
  networks: [bsc, mainnet, polygon, base],
  defaultNetwork: bscTestnet,
  themeMode: 'dark',
  uiMode: 'modal',
  storage: 'local',
  smartSession: false,
  themeVariables: {
    '--w3m-accent': '#000000',
    "--w3m-font-family": "sans-serif",
    "--w3m-accent-color": "#3B82F6",
  },
  features: {
    analytics: true,
  },
});