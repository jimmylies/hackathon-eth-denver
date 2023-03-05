import React, { useState, useEffect } from 'react';
import { faArrowsRotate, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/Button';
import InvertTokens from 'components/InvertTokens';
import Toggle from 'components/Toggle';
import TokenInput from 'components/TokenInput';
import Tooltip from 'components/Tooltip';
import usePairManager from 'hooks/usePairManager';
import { getSlippage } from 'utils/methods';
import { Token } from 'utils/tokens';
import {
  buildAddOrderTx,
  buildIncreaseAllowanceTx,
  buildSwapTx
} from 'utils/transactionBuilder';
import { useSendTransaction } from 'hooks/useSendTransaction';
import './index.scss';
import Lens from 'components/Lens';

interface SwapCardProps {
  token0: Token;
  setToken0: React.Dispatch<React.SetStateAction<Token>>;
  token1: Token;
  setToken1: React.Dispatch<React.SetStateAction<Token>>;
  displayChart: boolean;
  setDisplayChart: React.Dispatch<React.SetStateAction<boolean>>;
  setInvert: React.Dispatch<React.SetStateAction<boolean>>;
}

const SwapCard = ({
  token0,
  setToken0,
  token1,
  setToken1,
  displayChart,
  setDisplayChart,
  setInvert
}: SwapCardProps) => {
  const [advanced, setAdvanced] = useState(false);
  const [limitValue, setLimitValue] = useState(0);
  const [limitValueDiff, setLimitValueDiff] = useState(0);
  const [isSellOrder, setIsSellOrder] = useState(true);

  const {
    balance0,
    balance1,
    quantity0,
    quantity1,
    price,
    priceImpact,
    pairAddress,
    dollarValue,
    userAllowance0,
    userAllowance1,
    changeQuantityWithPriceImpact,
    changeToken,
    invertTokens,
    fetchBalances
  } = usePairManager({ token0, setToken0, token1, setToken1 });

  const invertTokensWrap = () => {
    invertTokens();
    setInvert((prevState) => !prevState);
  };

  const handleChangeLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLimitValue(value);
    setLimitValueDiff((((price - value) * 100) / price) * -1);
  };

  useEffect(() => {
    setLimitValue(price);
  }, [price]);

  useEffect(() => {
    console.log(priceImpact);
  }, [priceImpact]);

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div className='SwapCard feature'>
      <div className='header-feature'>
        <h2>Swap</h2>
      </div>

      <div className='container-feature'>
        <div className='TokenInput-wrapper'>
          <TokenInput
            isConnected={true}
            headerText={'From'}
            token={token0}
            changeToken={(t: Token) => changeToken(t, true)}
            quantity={quantity0}
            changeQuantity={(q: number) =>
              changeQuantityWithPriceImpact(q, true)
            }
            balance={balance0}
            isChangeable={true}
            dollarValue={quantity0 > 0 ? dollarValue * quantity0 : 0}
          />

          <InvertTokens handleInvert={invertTokensWrap} />
        </div>

        <TokenInput
          isConnected={true}
          headerText='To'
          token={token1}
          changeToken={(t: Token) => changeToken(t, false)}
          quantity={
            !advanced
              ? quantity0 * price * ((100 - priceImpact) / 100)
              : limitValue * quantity0
          }
          changeQuantity={(q: number) =>
            changeQuantityWithPriceImpact(q, false)
          }
          balance={balance1}
          isChangeable={true}
          dollarValue={quantity0 > 0 ? dollarValue * quantity0 : 0}
        />

        <div className='toggle-container'>
          <Toggle setOn={setAdvanced} />
          <span>Limit order</span>
        </div>

        {advanced && (
          <div className='advanced'>
            <div className='limit-container'>
              <div className='top'>
                <span>PRICE</span>
                <button onClick={() => setLimitValue(price)}>
                  <FontAwesomeIcon icon={faArrowsRotate} />
                  <span>MARKET</span>
                </button>
                {!isNaN(limitValue) && (
                  <span
                    className={`limitValueDiff ${
                      limitValueDiff < 0 ? 'below' : 'above'
                    }`}
                  >
                    {limitValueDiff.toFixed(2)}%{' '}
                    {limitValueDiff < 0 ? 'below' : 'above'} market
                  </span>
                )}
              </div>
              <input
                type='number'
                value={isSellOrder ? limitValue : 1 / limitValue}
                onChange={handleChangeLimit}
              />
              <div className='bottom'>
                <span>
                  {isSellOrder
                    ? `${token1.symbol} per ${token0.symbol}`
                    : `${token0.symbol} per ${token1.symbol}`}
                </span>
                <FontAwesomeIcon
                  icon={faRightLeft}
                  onClick={() => setIsSellOrder((prev) => !prev)}
                />
              </div>
            </div>
          </div>
        )}

        {!advanced && price !== -1 && (
          <div className='swap-details'>
            <div className='details'>
              <span>Price</span>
              <span>
                {price &&
                  `1 ${token1.symbol} ≃ ${(1 / price).toFixed(2)} ${
                    token0.symbol
                  }`}
              </span>
            </div>
            <div className='details'>
              <Tooltip variant='slippage' />
              <span>{getSlippage()}%</span>
            </div>
            <div className='details'>
              <span>Swap Impact</span>
              <span
                className={`${
                  priceImpact > 2.5 && (priceImpact > 5 ? 'red' : 'orange')
                }`}
              >
                {priceImpact > 100 ? '99,99' : priceImpact.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
        <div className='buttonAndLens'>
          {advanced ? (
            <Button variant='outlined' text='Place an order' />
          ) : (
            <Button
              variant='outlined'
              text={`${
                (userAllowance0 && userAllowance1) === 0 ? 'Swap' : 'Swap'
              }`}
            />
          )}

          <Lens text={advanced ? 'Limit Order' : 'Swap'} />
        </div>
      </div>
    </div>
  );
};

export default SwapCard;
