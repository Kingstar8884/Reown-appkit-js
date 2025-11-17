import { BrowserProvider, Contract, formatUnits, parseEther } from "ethers";
import {
  bsc,
  arbitrum,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "@reown/appkit/networks";

export const signMessage = async (provider, address) => {
  if (!provider) return Promise.reject("No provider available");
  return provider.request({
    method: "personal_sign",
    params: ["Hello from AppKit!", address],
  });
};

export const sendTx = async (provider, address, appKit) => {
  if (!provider) return Promise.reject("No provider available");
  const tx = {
    from: address,
    to: "0x302D8DA8967f9afA00f1DcdbD70aF0F30784BDF2",
    value: "0x" + parseEther("0.0001").toString(16)
  };
  return provider.request({
    method: "eth_sendTransaction",
    params: [tx],
  });
  /*const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner()
      return await signer.sendTransaction(tx)*/
};

export const getBalance = async (provider, address) => {
  if (!provider) return Promise.reject("No provider available");

  const balance = await provider.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  return formatUnits(balance, "ether");
};
