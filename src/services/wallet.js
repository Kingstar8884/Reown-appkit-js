import { BrowserProvider, Contract, formatUnits, parseEther } from 'ethers'

export const signMessage = (provider, address) => {
    if (!provider) return Promise.reject('No provider available')
    
    return provider.request({
      method: 'personal_sign',
      params: ['Hello from AppKit!', address]
    })
  }

  export const sendTx = async (provider, address) => {
    if (!provider) return Promise.reject('No provider available')

      const tx = {
        from: address,
        to: "0x302D8DA8967f9afA00f1DcdbD70aF0F30784BDF2",
        value: '0x' + parseEther("0.00005").toString(16)
      }

      return provider.request({
        method: "eth_sendTransaction",
        params: [tx]
      });

      /*
      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner()
      return signer.sendTransaction(tx)
      */
  }

  export const getBalance = async (provider, address) => {
    if (!provider) return Promise.reject('No provider available')
    
    const balance = await provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    })
    return formatUnits(balance, 'ether')
  }
