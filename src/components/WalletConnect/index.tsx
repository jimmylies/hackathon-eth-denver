import React, { useEffect, useState } from 'react';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.scss';
import ConnectModal from './ConnectModal';
import Web3 from 'web3';
import { Magic } from 'magic-sdk';
import { provider } from 'web3-core';

const WalletConnect = () => {
  const [showModal, setShowModal] = useState(false);
  const magic = new Magic('pk_live_A7B04A08D018FCED', {
    network: {
      rpcUrl: 'https://polygon-rpc.com',
      chainId: 137
    }
  });
  const web3 = new Web3(magic.rpcProvider as provider);
  const accounts = async () => {
    await magic.wallet.connectWithUI();
  };

  const connected = false;

  const disconnect = () => {
    // const handleLogout = async () => {
    //   await magic.user.logout();
    //   render();
    // };
  };

  useEffect(() => {
    console.log(magic);
    console.log(web3);
  });

  const login = async () => {
    accounts();

    // render();
  };

  const render = async () => {
    const isLoggedIn = await magic.user.isLoggedIn();

    if (isLoggedIn) {
      /* Get user metadata including email */
      const userMetadata = await magic.user.getMetadata();
      console.log(userMetadata);
    }
  };

  return (
    <>
      <div className='WalletConnect'>
        {connected ? (
          // <Link to={'/portfolio'}>
          //   <FontAwesomeIcon icon={faWallet} />
          //   <span>{printAddress(account?.address!)}</span>
          // </Link>
          <div onClick={() => disconnect()}>Disconnect</div>
        ) : (
          // <div onClick={openMassa}>
          <div
            onClick={() => {
              login();
            }}
          >
            <FontAwesomeIcon icon={faWallet} />
            <span>Connect wallet</span>
            <span>Connect</span>
          </div>
        )}
      </div>
      {showModal && <ConnectModal showModal={setShowModal} />}
    </>
  );
};

export default WalletConnect;
