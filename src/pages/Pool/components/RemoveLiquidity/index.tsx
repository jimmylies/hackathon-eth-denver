import React, { useEffect, useState } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import ConfirmButton from 'components/ConfirmButton';
import ErrorPage from 'pages/ErrorPage';
import { routerSC } from 'utils/config';
import {
  fetchLPTokenSupply,
  fetchTokenBalance,
  fetchUserSpecificLiquidity
} from 'utils/datastoreFetcher';
import { isAddressValid } from 'utils/methods';
import { buildRemoveLiquidityTx } from 'utils/transactionBuilder';
import { ExtendedLiquidity } from '../MyLiquidity';
import './index.scss';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useBearby } from '@hicaru/bearby-react';
import useGetTokensFromURL from 'hooks/useGetTokensFromURL';

const RemoveLiquidity = () => {
  const [amount, setAmount] = useState(50);
  const [valid, setValid] = useState(true);
  const [liquidity, setLiquidity] = useState<ExtendedLiquidity>();

  const { base58 } = useBearby();
  const { token0: poolToken0, token1: poolToken1 } = useGetTokensFromURL();
  const location = useLocation();

  const value = (liquidity!.quantity * amount) / 100;
  const { isTxPending, submitTx: removeLiquidity } = useSendTransaction({
    data: buildRemoveLiquidityTx(
      liquidity!.token0.address,
      liquidity!.token1.address,
      value
    )
  });
  console.log(liquidity, value);

  const fetchLiquidity = async () => {
    if (!base58 || !poolToken0 || !poolToken1) return;
    const liq = await fetchUserSpecificLiquidity(
      base58,
      poolToken0,
      poolToken1
    );

    const supply = await fetchLPTokenSupply(liq.poolAddress);
    const poolShare = liq.quantity / supply;

    const bal0 = await fetchTokenBalance(
      liq.token0.address,
      liq.poolAddress
    );
    const bal1 = await fetchTokenBalance(
      liq.token1.address,
      liq.poolAddress
    );

    setLiquidity({
      poolAddress: liq.poolAddress,
      token0: liq.token0,
      token1: liq.token1,
      quantity: liq.quantity,
      poolShare,
      amount0: (bal0 * poolShare) / 10 ** liq.token0.decimals,
      amount1: (bal1 * poolShare) / 10 ** liq.token1.decimals
    });
  };

  useEffect(() => {
    if (
      !poolToken0 ||
      !isAddressValid(poolToken0) ||
      !poolToken1 ||
      !isAddressValid(poolToken1)
    )
      setValid(false);
  }, [poolToken0, poolToken1]);

  useEffect(() => {
    const liquidityProp: ExtendedLiquidity =
      location.state && (location.state as any).liquidity;
    liquidityProp === null ? fetchLiquidity() : setLiquidity(liquidityProp);
  }, []);

  return (
    <>
      {liquidity && valid ? (
        <div className='RemoveLiquidity feature'>
          <div className='header-feature'>
            <Link to='/pools'>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <div>
              <h2>
                Remove {liquidity.token0.symbol}-{liquidity.token1.symbol}{' '}
                liquidity
              </h2>
              <h4>
                To receive {liquidity.token0.symbol} and{' '}
                {liquidity.token1.symbol}
              </h4>
            </div>
          </div>

          <div className='container-feature'>
            <div className='select-amount'>
              <div className='amount'>{amount}%</div>
              <input
                type='range'
                min={1}
                max={100}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
              <div className='default-values'>
                {[25, 50, 75, 100].map((value) => {
                  return (
                    <div key={value} onClick={() => setAmount(value)}>
                      {value === 100 ? 'Max' : `${value}%`}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='recap'>
              <span>YOU WILL RECEIVE</span>
              <div className='recap-details'>
                <div className='recap-detail'>
                  <div className='pair'>
                    <img src={liquidity.token0.logoURI} alt='token-logo' />
                    <span>{liquidity.token0.symbol}</span>
                  </div>
                  <span>
                    {
                      (
                        (liquidity.amount0 * amount * 100) /
                        10 ** liquidity.token0.decimals
                      ).toFixed(2) /*.replace(/[.,]0+$/, '')*/
                    }
                  </span>
                </div>
                <div className='recap-detail'>
                  <div className='pair'>
                    <img src={liquidity.token1.logoURI} alt='token-logo' />
                    <span>{liquidity.token1.symbol}</span>
                  </div>
                  <span>
                    {
                      (
                        (liquidity.amount1 * amount * 100) /
                        10 ** liquidity.token1.decimals
                      ).toFixed(2) /*.replace(/[.,]0+$/, '')*/
                    }
                  </span>
                </div>
              </div>
            </div>

            <ConfirmButton
              tokenAddress={liquidity.poolAddress}
              spender={routerSC}
              value={value}
              text='Remove'
              sendTx={removeLiquidity}
            />
          </div>
        </div>
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default RemoveLiquidity;
