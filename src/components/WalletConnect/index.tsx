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
  const [connected, setConnected] = useState(false);
  const magic = new Magic('pk_live_A7B04A08D018FCED', {
    network: {
      rpcUrl: 'https://polygon-rpc.com',
      chainId: 137
    }
  });
  const web3 = new Web3(magic.rpcProvider as provider);

  const disconnect = async () => {
    await magic.wallet.disconnect();
    render();
  };

  useEffect(() => {
    render();
  }, [magic.wallet]);

  const login = async () => {
    await magic.wallet.connectWithUI();
    render();
  };

  const render = async () => {
    await magic.wallet
      .getInfo()
      .then(() => {
        setConnected(true);
      })
      .catch(() => {
        setConnected(false);
      });
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
