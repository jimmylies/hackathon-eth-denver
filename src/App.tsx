import React, { useEffect, useState } from 'react';
import { BearbyProvider } from '@hicaru/bearby-react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
import Header from './components/Header';
import ScrollToTop from './ScrollToTop';
import 'react-toastify/dist/ReactToastify.css';
import './assets/sass/index.scss';
import { WalletContext } from 'context/WalletContext';
import { IAccount, WalletClient } from '@massalabs/massa-web3';

const App = () => {
  const [account, setAcc] = useState<IAccount>();

  useEffect(() => {
    const sk = localStorage.getItem('account');
    if (sk && sk.startsWith('S'))
      WalletClient.getAccountFromSecretKey(sk).then((acc) => setAcc(acc));
  }, []);

  const setAccount = (acc: IAccount) => {
    setAcc(acc);
    localStorage.setItem('account', acc.secretKey ?? '');
  };

  const disconnect = () => {
    setAcc(undefined);
    localStorage.removeItem('account');
  };

  return (
    <div className='App'>
      <WalletContext.Provider value={{ account, setAccount, disconnect }}>
        <BearbyProvider>
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </BearbyProvider>
      </WalletContext.Provider>
      <ToastContainer theme='dark' />
      <ScrollToTop />
    </div>
  );
};

export default App;
