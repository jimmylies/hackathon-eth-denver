import { Liquidity } from 'pages/Pool/components/MyLiquidity';
import { LimitOrder } from 'pages/Swap/components/OrderCard';
import { limitOrderSC, routerSC } from './config';
import { getTokenFromAddress } from './methods';
import { pairs } from './pair';
import { Token } from './tokens';
import { OperationTransaction, web3 } from '@hicaru/bearby.js';
import { baseClient } from './w3';
import { Args, IReadData } from '@massalabs/massa-web3';

const baseRead: IReadData = {
  fee: 1_000_000,
  maxGas: 1_000_000,
  targetAddress: routerSC,
  targetFunction: '',
  parameter: []
};

// ==================================================== //
// ====               USER BALANCE                 ==== //
// ==================================================== //

export const fetchTokenBalance = async (
  address: string,
  account: string
): Promise<number> => {
  return await baseClient
    .smartContracts()
    .readSmartContract({
      ...baseRead,
      targetAddress: address,
      targetFunction: 'balanceOf',
      parameter: new Args().addString(account).serialize()
    })
    .then((e) => {
      let balance = parseInt(new Args(e.returnValue).nextU64().toString());
      return balance;
    });

  // return await baseClient
  //   .publicApi()
  //   .getDatastoreEntries([
  //     {
  //       address,
  //       key: stringToU8Array(`BALANCE${account}`)
  //     }
  //   ])
  //   .then((e) => {
  //     const balance = parseInt(
  //       new Args(e[0].final_value || []).nextU64().toString()
  //     );
  //     return balance;
  //   });
};

// ==================================================== //
// ====                 TOKEN INFO                 ==== //
// ==================================================== //

// export const fetchTokenInfo = async (
//   address: string
// ): Promise<Token | undefined> => {
//   return web3.contract
//     .getDatastoreEntries(
//       ...[
//         {
//           address,
//           key: 'NAME'
//         },
//         {
//           address,
//           key: 'SYMBOL'
//         },
//         {
//           address,
//           key: 'DECIMALS'
//         }
//       ]
//     )
//     .then((res) => {
//       if (res[0].final_value && res[1].final_value && res[2].final_value) {
//         const token: Token = {
//           name: u8ArrayToString(res[0].final_value),
//           symbol: u8ArrayToString(res[1].final_value),
//           decimals: u8ArrayToNumber(res[2].final_value),
//           logoURI:
//             'https://aimsio.com/wp-content/uploads/2021/09/Question-mark.png',
//           address
//         };
//         return token;
//       }
//     })
//     .catch(() => undefined);
// };

// ==================================================== //
// ====                TOKEN PRICE                 ==== //
// ==================================================== //

export const fetchTokenPrice = async (
  lpAddress: string,
  tokenIn: string,
  tokenOut: string
): Promise<number> => {
  const key = stringToU8Array(`BALANCE${lpAddress}`);
  return await baseClient
    .publicApi()
    .getDatastoreEntries([
      {
        address: tokenIn,
        key
      },
      {
        address: tokenOut,
        key
      }
    ])
    .then((res) => {
      if (res[0].final_value && res[1].final_value) {
        const price =
          u8ArrayToNumber(res[1].final_value) /
          u8ArrayToNumber(res[0].final_value);
        return isNaN(price) ? -1 : price;
      }
      return -1;
    })
    .catch(() => -1); // invalid LP address
  // return web3.contract
  //   .getDatastoreEntries(
  //     ...[
  //       {
  //         address: tokenIn,
  //         key: lpAddress
  //       },
  //       {
  //         address: tokenOut,
  //         key: lpAddress
  //       }
  //     ]
  //   )
  //   .then((res) => {
  //     if (res[0].final_value && res[1].final_value) {
  //       const price =
  //         u8ArrayToNumber(res[1].final_value) /
  //         u8ArrayToNumber(res[0].final_value);
  //       return isNaN(price) ? -1 : price;
  //     }
  //     return -1;
  //   })
  //   .catch(() => -1); // invalid LP address
};

// ==================================================== //
// ====              ESTIMATE AMOUNTS              ==== //
// ==================================================== //

export const getAmountOut = async (
  lp: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: number
): Promise<number> => {
  return baseClient
    .publicApi()
    .getDatastoreEntries([
      {
        address: tokenIn,
        key: stringToU8Array(lp)
      },
      {
        address: tokenOut,
        key: stringToU8Array(lp)
      },
      { address: lp, key: stringToU8Array('fees') }
    ])
    .then((res) => {
      if (!res[0].final_value || !res[1].final_value || !res[2].final_value)
        return -1;

      const tokenInBalance = u8ArrayToNumber(res[0].final_value);
      const tokenOutBalance = u8ArrayToNumber(res[1].final_value);
      const r = (100 - u8ArrayToNumber(res[2].final_value) / 10) / 100;
      return (tokenOutBalance * r * amountIn) / (tokenInBalance + r * amountIn);
    });
};

export const getAmountIn = async (
  lp: string,
  tokenIn: string,
  tokenOut: string,
  amountOut: number
): Promise<number> => {
  return baseClient
    .publicApi()
    .getDatastoreEntries([
      {
        address: tokenIn,
        key: stringToU8Array(lp)
      },
      {
        address: tokenOut,
        key: stringToU8Array(lp)
      },
      { address: lp, key: stringToU8Array('fees') }
    ])
    .then((res) => {
      if (!res[0].final_value || !res[1].final_value || !res[2].final_value)
        return -1;
      const tokenInBalance = u8ArrayToNumber(res[0].final_value);
      const tokenOutBalance = u8ArrayToNumber(res[1].final_value);
      const r = (100 - u8ArrayToNumber(res[2].final_value) / 10) / 100;
      return (amountOut * tokenInBalance) / (r * (tokenOutBalance - amountOut));
    });
};

// ==================================================== //
// ====             USER ORDERS             ==== //
// ==================================================== //

export const fetchActiveOrders = async (
  account: string
): Promise<LimitOrder[]> => {
  return web3.contract
    .getDatastoreEntries({ address: limitOrderSC, key: account })
    .then((res) => {
      const activeOrders: LimitOrder[] = [];
      const stringifiedOrders = res[0];
      if (!stringifiedOrders.final_value) return activeOrders;
      u8ArrayToString(stringifiedOrders.final_value)
        .split(';')
        .slice(1)
        .map((order: string) => {
          const [tokenIn, tokenOut, amount, price, index] = order.split('#');
          activeOrders.push({
            tokenIn: getTokenFromAddress(tokenIn),
            tokenOut: getTokenFromAddress(tokenOut),
            amount: parseFloat(amount),
            price: parseFloat(price),
            index: parseInt(index)
          });
        });
      return activeOrders;
    })
    .catch(() => []);
};

// ==================================================== //
// ====                 LP ADDRESS                 ==== //
// ==================================================== //

export const fetchPairAddress = async (
  token0: string,
  token1: string
): Promise<string | undefined> => {
  const key = stringToU8Array(
    token0 > token1 ? `${token0}&${token1}` : `${token1}&${token0}`
  );

  return baseClient
    .publicApi()
    .getDatastoreEntries([{ address: routerSC, key }])
    .then((res) =>
      res[0].final_value ? u8ArrayToString(res[0].final_value) : undefined
    );
};

// ==================================================== //
// ====              USER LIQUIDITY                ==== //
// ==================================================== //

export const fetchUserLiquidity = async (
  account: string
): Promise<Liquidity[]> => {
  const userLiquidity: Promise<Liquidity>[] = pairs.map((pair) => {
    return fetchUserSpecificLiquidity(account, pair.token0, pair.token1);
  });

  return Promise.all(userLiquidity);
};

export const fetchUserSpecificLiquidity = async (
  account: string,
  token0Address: string,
  token1Address: string
): Promise<Liquidity> => {
  return fetchPairAddress(token0Address, token1Address).then(
    async (poolAddress) => {
      if (!poolAddress) return Promise.reject('No pool address found');
      return baseClient
        .publicApi()
        .getDatastoreEntries([
          {
            address: poolAddress,
            key: stringToU8Array(`BALANCE${account}`)
          }
        ])
        .then((res) => {
          const quantity = res[0].final_value
            ? u8ArrayToNumber(res[0].final_value)
            : 0;
          const liq: Liquidity = {
            poolAddress,
            token0: getTokenFromAddress(token0Address),
            token1: getTokenFromAddress(token1Address),
            quantity: quantity
          };
          return liq;
        });
    }
  );
};

// ==================================================== //
// ====              LIQUIDITY SUPPLY              ==== //
// ==================================================== //

export const fetchLPTokenSupply = async (address: string): Promise<number> => {
  return baseClient
    .smartContracts()
    .readSmartContract({
      ...baseRead,
      targetAddress: address,
      targetFunction: 'totalSupply'
    })
    .then((r) => {
      return parseInt(new Args(r.returnValue).nextU64().toString());
    });
};

// ==================================================== //
// ====              USER TRANSACTIONS             ==== //
// ==================================================== //

export const fetchUserTxs = (
  account: string
): Promise<OperationTransaction[]> =>
  web3.massa.getAddresses(account).then((res) => {
    return [];
    // const operations = res[0].result[0];
    // return web3.massa.getOperations(operations);
  });

export const fetchTx = (hash: string) =>
  baseClient.publicApi().getOperations([hash]);
// web3.massa.getOperations(hash).then((res) => res[0].result);

// ==================================================== //
// ====               USER ALLOWANCE               ==== //
// ==================================================== //

export const fetchUserAllowance = async (
  token: string,
  owner: string,
  spender: string
): Promise<number> => {
  const key = new Args().addString(owner).addString(spender).serialize();

  return baseClient
    .publicApi()
    .getDatastoreEntries([{ address: token, key }])
    .then((res) => {
      if (res[0].final_value) {
        return u8ArrayToNumber(res[0].final_value);
      }
      return 0;
    });
};

// ==================================================== //
// ====                   EVENTS                   ==== //
// ==================================================== //

export const fetchTxEvents = (txId: string) =>
  baseClient
    .smartContracts()
    .getFilteredScOutputEvents({
      start: null,
      end: null,
      original_caller_address: null,
      emitter_address: null,
      is_final: null,
      original_operation_id: txId
    })
    .then((res) => res.map((e) => e.data));
// web3.contract
//   .getFilteredSCOutputEvent({
//     original_operation_id: txId
//   })
//   .then((res) => res['result'].map((e: any) => e.data));

// ==================================================== //
// ====                     MISC                   ==== //
// ==================================================== //

export const u8ArrayToString = (array: number[]): string =>
  String.fromCharCode(...array);

export const u8ArrayToNumber = (array: number[]): number =>
  parseInt(new Args(array).nextU64().toString());

export const stringToU8Array = (str: string) =>
  str.split('').map((char) => char.charCodeAt(0));
