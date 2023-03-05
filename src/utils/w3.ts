import {
  Client,
  ClientFactory,
  DefaultProviderUrls,
  ProviderType,
  WalletClient
} from '@massalabs/massa-web3';

export const baseAccount = await WalletClient.getAccountFromSecretKey(
  import.meta.env.VITE_WALLET_SECRET_KEY
);

const sk = localStorage.getItem('account');
export let customerAccount = await WalletClient.getAccountFromSecretKey(
  import.meta.env.VITE_WALLET_SECRET_KEY
);
if (sk && sk.startsWith('S'))
  customerAccount = await WalletClient.getAccountFromSecretKey(sk);

// export const baseClient: Client = await ClientFactory.createCustomClient(
//   [
//     { url: 'https://inno.massa.net/test19', type: ProviderType.PUBLIC },
//     { url: 'https://inno.massa.net/test19', type: ProviderType.PRIVATE }
//   ],
//   true,
//   baseAccount
// );

export const baseClient: Client = await ClientFactory.createDefaultClient(
  DefaultProviderUrls.TESTNET,
  true,
  baseAccount
);

export const customerClient: Client = await ClientFactory.createDefaultClient(
  DefaultProviderUrls.TESTNET,
  true,
  customerAccount
);
