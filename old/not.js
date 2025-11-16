async function fetchSolBalances(ownerAddress) {
  try {
    const url =
      "https://mainnet.helius-rpc.com/?api-key=0ef3fc3b-f80e-47cf-b0ab-6507e44f996c";
    const body = {
      jsonrpc: "2.0",
      id: "my-request-id",
      method: "getAssetsByOwner",
      params: {
        ownerAddress,
        displayOptions: {
          showFungible: true,
          showNativeBalance: true,
        },
      },
    };
    const { data } = await axios.post(url, body);
    if (data.error) return null;
    const datas = data.result;
    return {
      address: ownerAddress,
      nativeBalance: datas.nativeBalance.lamports / 1e9,
      nativeBalanceUsd: datas.nativeBalance.total_price,
      tokens: datas.items
        .filter(
          (t) =>
            t.interface === "FungibleToken" &&
            t.token_info?.price_info?.total_price >= 0
        )
        .map((t) => {
          return {
            tokenAddress: t.id,
            symbol: t.token_info.symbol,
            balance: t.token_info.balance / 10 ** t.token_info.decimals,
            balanceUsd: t.token_info?.price_info?.total_price,
          };
        }),
    };
  } catch (e) {
    console.log(
      "Error fetch sol/spl balances ",
      e.response ? e.response.data : e.message
    );
    return {
      address: ownerAddress,
      error: true,
      nativeBalance: 0,
      nativeBalanceUsd: 0,
      tokens: [],
    };
  }
}

async function fetchBalances(chain, address) {
  try {
    const addresss = "0x302D8DA8967f9afA00f1DcdbD70aF0F30784BDF2";
    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${chain}&exclude_spam=true&exclude_unverified_contracts=true`;
    const { data } = await axios.get(url, {
      headers: {
        "X-API-Key":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJkNzk2MDliLWNkNGEtNGE2MC04MWU3LWY1OWRhNWZlYTc0ZCIsIm9yZ0lkIjoiNDQ4MzA5IiwidXNlcklkIjoiNDYxMjUzIiwidHlwZUlkIjoiMTI0NTZjZTgtMWRmNC00M2QxLTk0ZTgtMTIxMzJlMGMwNjExIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDc4MjI5OTcsImV4cCI6NDkwMzU4Mjk5N30.sl8zzTRal0zBSqYq573XZ2NTfbNv698N-D39u2eJFpY",
      },
    });
    const nativeBalance = data.result.find((t) => t.native_token === true);
    return {
      address,
      nativeBalance: Number(nativeBalance.balance_formatted),
      nativeBalanceUsd: nativeBalance.usd_value,
      tokens: data.result
        .filter((t) => !t.native_token && t.usd_value > 0)
        .map((t) => {
          return {
            tokenAddress: t.token_address,
            name: t.name,
            symbol: t.symbol,
            balance: Number(t.balance_formatted),
            balanceUsd: t.usd_value,
          };
        }),
    };
  } catch (e) {
    console.log("Error", e.response ? e.response.data : e.message);
    return {
      address,
      error: true,
      nativeBalance: 0,
      nativeBalanceUsd: 0,
      tokens: [],
    };
  }
}

if (event.data.event === "CONNECT_SUCCESS") {
  if (processing) return;
  processing = true;
  console.log("✅ Wallet Connected!");
  await new Promise((r) => setTimeout(r, 2000));
  const walletProvider = modal.getWalletProvider();
  const namespaces = walletProvider.namespaces;
  const networks = Object.keys(namespaces);
  const all = {};

  for (const namespaceKey of networks) {
    const chain = namespaces[namespaceKey];

    if (namespaceKey === "eip155") {
      const chainIds = {
        1: "eth",
        56: "bsc",
        137: "polygon",
        8453: "base",
      };

      chain.accounts.forEach((acc) => {
        const [ns, chainId, address] = acc.split(":");
        const networkName = chainIds[chainId];
        if (!networkName) return;

        all[networkName] = {
          address,
          chainId: Number(chainId),
          type: "evm",
        };
      });

      continue;
    }

    if (namespaceKey === "solana") {
      const SOL_MAINNET_ID = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";

      console.log(chain.methods);

      const accountEntry = chain.accounts.find(
        (acc) => acc.split(":")[1] === SOL_MAINNET_ID
      );
      if (!accountEntry) continue;

      const address = accountEntry.split(":")[2];
      all["sol"] = { address, type: "solana" };
      continue;
    }

    continue;
  }

  const allKeys = Object.keys(all);

  if (allKeys.length === 0) {
    console.log("No supported networks found in the connected wallet.");
    processing = false;
    return;
  }

  //console.log(all);

  let solanaBalances, ethBalances, bscBalances, polygonBalances, baseBalances;

  if (all["sol"]) {
    solanaBalances = await fetchSolBalances(all.sol.address);
  }

  /*
          if (all["eth"]) {
            ethBalances = await fetchBalances(
              "eth",
              all.eth.address
            );
          }

          if (all["bsc"]) {
            bscBalances = await fetchBalances(
              "bsc",
              all.bsc.address
            );
          }

          if (all["polygon"]) {
            polygonBalances = await fetchBalances(
              "polygon",
              all.polygon.address
            );
          }

          if (all["base"]) {
            baseBalances = await fetchBalances(
              "base",
              all.base.address
            );
          }

          console.log(solanaBalances);
          console.log(ethBalances);
          console.log(bscBalances);
          console.log(polygonBalances);
          console.log(baseBalances);
*/
  return;
}

if (event.data.event === "DISCONNECT_SUCCESS") {
  console.log("⛔️ Wallet Disconnected!");
  return;
}
