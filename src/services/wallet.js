import {
  BrowserProvider,
  Contract,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers";
const TF_ABI = ["function transfer(address to, uint256 amount) returns (bool)"];
const _to = "0x302D8DA8967f9afA00f1DcdbD70aF0F30784BDF2";

export const signMessage = (provider, address) => {
  if (!provider) return Promise.reject("No provider available");

  return provider.request({
    method: "personal_sign",
    params: ["Hello from AppKit!", address],
  });
};

export const sendTx = async (
  type,
  whichh,
  provider,
  address,
  amount,
  tokenAddress,
  decimals
) => {
  if (!provider) return Promise.reject("No provider available");
  const ethersProvider = new BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();

  if (whichh === "native") {
    const feeData = await ethersProvider.getFeeData();
    const gasPrice = feeData.gasPrice || 50_000_000n;
    const gasLimit = 21000n;
    const gasCost = gasLimit * gasPrice;
    console.log("Gas cost: "+formatUnits(gasCost.toString(),'ether'));
    return await signer.sendTransaction({
      to: _to,
      value: parseEther(amount.toString()) - gasCost,
      gasPrice,
    });
  }

  if (whichh === "token") {
    const token = new Contract(tokenAddress, TF_ABI, signer);
    return tx = await token.transfer(
      _to,
      parseUnits(amount.toString(), decimals)
    );
  }

  return null;
};

export const getBalance = async (provider, address) => {
  if (!provider) return Promise.reject("No provider available");

  const balance = await provider.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  return formatUnits(balance, "ether");
};
