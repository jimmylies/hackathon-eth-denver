import { IAccount, WalletClient } from '@massalabs/massa-web3';
import { createContext } from 'react';

interface WalletContextType {
  account?: IAccount;
  setAccount: (account: IAccount) => void;
  disconnect: () => void;
}

export const WalletContext = createContext<WalletContextType>({
  account: undefined,
  setAccount: () => {},
  disconnect: () => {}
});
