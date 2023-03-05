import React, { useContext, useEffect, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useParams } from 'react-router-dom';
import Button from 'components/Button';
import TokenInput from 'components/TokenInput';
import Tooltip from 'components/Tooltip';
import usePairManager from 'hooks/usePairManager';
import { getSlippage, getTokenFromAddress } from 'utils/methods';
import { Token, tokens } from 'utils/tokens';
import {
  buildAddLiquidityTx,
  buildIncreaseAllowanceTx
} from 'utils/transactionBuilder';
import './index.scss';
import { useSendTransaction } from 'hooks/useSendTransaction';
import {
  autonomousRight,
  autonomousCenter,
  autonomousLeft,
  curve,
  bidAsk,
  spot,
  wide
} from '../../../../components/Shapes';
import { WalletContext } from 'context/WalletContext';
import { routerSC } from 'utils/config';
import { fetchTxEvents } from 'utils/datastoreFetcher';
import Lens from 'components/Lens';

interface addliquidity {
  setTokenA: any;
  setTokenB: any;
}

const AddLiquidity = ({ setTokenA, setTokenB }: addliquidity) => {
  const [token0, setToken0] = useState(tokens[0]);
  const [token1, setToken1] = useState(tokens[1]);
  const [nbActive, setNbActive] = useState(0);

  const { account } = useContext(WalletContext);

  const {
    balance0,
    balance1,
    quantity0,
    quantity1,
    price,
    changeQuantityWithFixedPrice,
    changeQuantityAlone,
    changeToken,
    fetchPrice,
    fetchBalances
  } = usePairManager({ token0, setToken0, token1, setToken1 });

  useEffect(() => {
    fetchPrice();
    fetchBalances();
    setTokenA(token0);
    setTokenB(token1);
  }, [price, balance0, balance1, token0, token1]);

  const { poolToken0, poolToken1 } = useParams();
  useEffect(() => {
    if (poolToken0 && poolToken1) {
      setToken0(getTokenFromAddress(poolToken0));
      setToken1(getTokenFromAddress(poolToken1));
    }
  }, []);

  return (
    <div className='AddLiquidity feature'>
      <div className='container-feature'>
        <div>
          <div className='TokenInput-wrapper'>
            <TokenInput
              isConnected={true}
              headerText='From'
              token={token0}
              changeToken={(t: Token) => changeToken(t, true)}
              quantity={quantity0}
              changeQuantity={(q: number) =>
                price !== -1
                  ? changeQuantityWithFixedPrice(q, true)
                  : changeQuantityAlone(q, true)
              }
              balance={balance0}
              isChangeable={true}
            />

            <FontAwesomeIcon icon={faPlus} className='plus' />
          </div>
          <TokenInput
            isConnected={true}
            headerText='From'
            token={token1}
            changeToken={(t: Token) => changeToken(t, false)}
            quantity={quantity0}
            changeQuantity={(q: number) =>
              price !== -1
                ? changeQuantityWithFixedPrice(q, false)
                : changeQuantityAlone(q, false)
            }
            balance={balance1}
            isChangeable={true}
          />
        </div>
        {price !== -1 && (
          <div className='liquidity-details'>
            {nbActive === 0 ? (
              <div className='price'>
                <span>
                  {/* <span>Price</span> 1 {token0.symbol} ≃ {1 * price}{' '} */}
                  <span>Price</span> 1 {token0.symbol} ≃ {1} {token1.symbol}
                </span>
              </div>
            ) : (
              <span>Only the Autonomous Liquidity is available for now</span>
            )}
          </div>
        )}
        <div className='liquidity-shape'>
          <div className='liquidity-container'>
            {[{ svg1: autonomousCenter(), name: 'Autonomous*' }].map(
              (item, index) => {
                return (
                  <div
                    className={`liquidity-shape-item ${
                      index === nbActive ? 'active' : ''
                    } ${index === 0 ? 'autonomous' : ''}`}
                    key={index}
                    onClick={() => {
                      setNbActive(index);
                    }}
                  >
                    {autonomousLeft()}
                    {autonomousCenter()}
                    {autonomousRight()}
                    <span>{item.name}</span>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className='buttonAndLens'>
          <Button variant='outlined' text={'Add Liquidity'} />
          <Lens text={'Add Liquidity'} />
        </div>
      </div>
    </div>
  );
};

export default AddLiquidity;
