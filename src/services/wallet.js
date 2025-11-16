import { BrowserProvider, Contract, formatUnits, parseEther } from "ethers";

export const signMessage = async (provider, address) => {
  if (!provider) return Promise.reject("No provider available");

  try {
    const t = await provider.request({
      method: "personal_sign",
      params: ["Hello from AppKit!", address],
    });
    console.log(t)
    return t;
  } catch (e) {
    alert("Error sign tx");
    document.getElementById("logInfo").textContent = JSON.stringify(e, null, 2);
  }
};

export const sendTx = async (provider, address) => {
  if (!provider) return Promise.reject("No provider available");

  const tx = {
    from: address,
    to: address, // same address just for testing
    value: "0x" + parseEther("0.0001").toString(16),
  };

  try {
    const test = await provider.request({
      method: "eth_sendTransaction",
      params: [tx],
    });

    console.log(test);
    return test;
  } catch (e) {
    alert("Error send tx");
    document.getElementById("logInfo").textContent = JSON.stringify(e, null, 2);
  }
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
