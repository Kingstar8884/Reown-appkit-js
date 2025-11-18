import { bsc, mainnet, polygon, base, solana } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

const projectId = "7cf68df23ef09d9a041b9e21530e2da1";

export const appKit = createAppKit({
  projectId,
  adapters: [new EthersAdapter()],
  networks: [bsc, mainnet, polygon, base],
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