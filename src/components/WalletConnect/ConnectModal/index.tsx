import React, { useContext, useRef, useState } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/Button';
import { printAddress } from 'utils/methods';
import './index.scss';
import { WalletContext } from 'context/WalletContext';
import { WalletClient } from '@massalabs/massa-web3';

const ConnectModal = ({ showModal }) => {
  const [skInput, setSkInput] = useState('');
  const background = useRef<HTMLDivElement>(null);

  const { account, setAccount } = useContext(WalletContext);

  const overflow = () => {
    showModal(false);
    document.body.style.overflow = 'auto';
  };

  const connect = async () => {
    await WalletClient.getAccountFromSecretKey(skInput).then((account) => {
      if (account) setAccount(account);
    });
    overflow();
  };

  return (
    <div className='ConnectModal'>
      <div
        className='ConnectModal-background'
        ref={background}
        onClick={(e) => {
          if (background.current === e.target) overflow();
        }}
      >
        <div className='ConnectModal-container'>
          <div className='top'>
            <div>Wallet connexion</div>
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => {
                overflow();
              }}
            />
          </div>
          <div className='ConnectModal-content'>
            <div>
              <span>Enter your secret key to login*</span>
              <input
                type='text'
                value={skInput}
                onChange={(e) => setSkInput(e.target.value)}
              />
              <span className='globalkey'>
                Global secret key for everyone:
                S12JdWfh7jjMHtJzdQ5sbznJhPtiShVBJ2MEkihENisByyKQMiPj
              </span>
              <Button
                text={'Connect wallet'}
                variant='outlined'
                onClick={connect}
              />
            </div>
            <span className='secretkey-asterix'>
              *Your secret key is only use to connect you to the dapp
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;
