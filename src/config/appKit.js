import { bsc, mainnet, polygon } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

const projectId = import.meta.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

export const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [bsc, mainnet, polygon],
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#000000',
  },
  features: {
    analytics: true,
  },
})