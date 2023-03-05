import React, { useState } from 'react';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Token } from 'utils/tokens';
import './index.scss';
import TokenModal from 'components/TokenModal';

interface TokenInputProps {
  headerText: string;
  isConnected: boolean;
  token: Token;
  changeToken: (t: Token) => void;
  quantity: number;
  changeQuantity: (q: number) => void;
  balance: number;
  isChangeable: boolean;
  dollarValue?: number;
}

const TokenInput = ({
  headerText,
  isConnected,
  token,
  changeToken,
  quantity,
  changeQuantity,
  balance,
  isChangeable,
  dollarValue
}: TokenInputProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='TokenInput'>
      <div className='select-amount'>
        <input
          type='number'
          autoComplete='off'
          autoCorrect='off'
          placeholder='0.0'
          value={quantity.toString().replace(/[.,]0+$/, '')}
          onChange={(e) => changeQuantity(parseFloat(e.currentTarget.value))}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
        <div
          className='select-token'
          onClick={() => {
            setShowModal(true);
            document.body.style.overflow = 'hidden';
          }}
        >
          <img src={token.logoURI} alt='logo' className='logo' />
          <span>{token.symbol}</span>
          {isChangeable && <FontAwesomeIcon icon={faAngleDown} />}
        </div>
      </div>
      <div className='details-token'>
        <div className='dollar-value'>
          {dollarValue && `$${dollarValue.toFixed(2)}`}
        </div>
        {isConnected && (
          <div className='balance'>
            <div className='balance-value'>
              Balance:{' '}
              {balance ? (balance / 10 ** token.decimals).toFixed(2) : '0.00'}
            </div>
            {headerText === 'From' &&
              quantity !== balance / 10 ** token.decimals && (
                <button
                  className='max-amount'
                  onClick={() => changeQuantity(balance / 10 ** token.decimals)}
                >
                  MAX
                </button>
              )}
          </div>
        )}
      </div>
      {showModal && isChangeable && (
        <TokenModal
          activeToken={token}
          changeActiveToken={changeToken}
          showModal={setShowModal}
        />
      )}
    </div>
  );
};

export default TokenInput;
