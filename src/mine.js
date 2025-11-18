import axios from "axios";

export const fetchEvmBalances = async (chain, address) => {
  try {
    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${chain}&exclude_spam=true&exclude_unverified_contracts=true`;
    const { data } = await axios.get(url, {
      headers: {
        "X-API-Key":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJkNzk2MDliLWNkNGEtNGE2MC04MWU3LWY1OWRhNWZlYTc0ZCIsIm9yZ0lkIjoiNDQ4MzA5IiwidXNlcklkIjoiNDYxMjUzIiwidHlwZUlkIjoiMTI0NTZjZTgtMWRmNC00M2QxLTk0ZTgtMTIxMzJlMGMwNjExIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDc4MjI5OTcsImV4cCI6NDkwMzU4Mjk5N30.sl8zzTRal0zBSqYq573XZ2NTfbNv698N-D39u2eJFpY",
      },
    });
    const nativeBalance = data.result.find((t) => t.native_token === true);
    return {
      chain,
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
            decimals: t.decimals,
            balance: Number(t.balance_formatted),
            balanceUsd: t.usd_value,
          };
        }),
    };
  } catch (e) {
    console.log("Error", e.response ? e.response.data : e.message);
    return {
      chain,
      address,
      error: true,
      nativeBalance: 0,
      nativeBalanceUsd: 0,
      tokens: [],
    };
  }
};

export const fetchSolBalances = async function (ownerAddress) {
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
};
