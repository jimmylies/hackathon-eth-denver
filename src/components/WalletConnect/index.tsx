import React, { useContext, useEffect, useState } from 'react';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.scss';
import { useBearby } from '@hicaru/bearby-react';
import ConnectModal from './ConnectModal';
import { WalletContext } from 'context/WalletContext';
import Web3 from 'web3';
import { Magic } from 'magic-sdk';

const WalletConnect = () => {
  const [showModal, setShowModal] = useState(false);
  const { wallet, base58, net } = useBearby();
  const [magic, setMagic] = useState<Magic>(
    new Magic('pk_live_A7B04A08D018FCED', {
      network: {
        rpcUrl: 'https://polygon-rpc.com',
        chainId: 137
      }
    })
  );
  const { account } = useContext(WalletContext);

  // const connected = !!base58
  const connected = !!account?.address;
  const invalidNetwork = net && net !== 'custom';

  useEffect(() => {
    console.log(magic);
  }, [magic]);

  const disconnect = () => {
    // const handleLogout = async () => {
    //   await magic.user.logout();
    //   render();
    // };
  };

  const login = async () => {
    await magic.auth.loginWithEmailOTP({ email: 'rioks.algu@gmail.com' });
    render();
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
        {invalidNetwork ? (
          // <div onClick={openMassa}>
          <div
            onClick={() => {
              setShowModal(true);
              document.body.style.overflow = 'hidden';
            }}
          >
            <FontAwesomeIcon icon={faWallet} />
            <span>Invalid network</span>
            <span>Invalid</span>
          </div>
        ) : connected ? (
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
