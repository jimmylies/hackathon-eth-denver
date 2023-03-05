import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from 'components/Button';
import {
  fetchLPTokenSupply,
  fetchTokenBalance,
  fetchUserSpecificLiquidity
} from 'utils/datastoreFetcher';
import { Token, tokens } from 'utils/tokens';
import './index.scss';
import { useBearby } from '@hicaru/bearby-react';
import { WalletContext } from 'context/WalletContext';
import { getTokenFromAddress } from 'utils/methods';

export interface Liquidity {
  poolAddress: string;
  token0: Token;
  token1: Token;
  quantity: number;
}

export interface ExtendedLiquidity extends Liquidity {
  poolShare: number;
  amount0: number;
  amount1: number;
}

const LP_TOKEN_DECIMALS = 6;

const MyLiquidity = () => {
  const [userLiquidity, setUserLiquidity] = useState<ExtendedLiquidity>();
  const [opened, setOpened] = useState<boolean[]>([]);
  const [token0, setToken0] = useState<Token>();
  const [token1, setToken1] = useState<Token>();

  // const { base58 } = useBearby();
  const { account } = useContext(WalletContext);

  const handleClick = (index: number) => {
    const copy = [...opened];
    copy[index] = !copy[index];
    setOpened(copy);
  };

  const { poolToken0, poolToken1 } = useParams();
  useEffect(() => {
    if (poolToken0 && poolToken1) {
      setToken0(getTokenFromAddress(poolToken0));
      setToken1(getTokenFromAddress(poolToken1));
    }
  }, []);

  useEffect(() => {
    const fetchLiquidity = async () => {
      if (account?.address && token0 && token1) {
        const res = await fetchUserSpecificLiquidity(
          account.address,
          token0.address,
          token1.address
        );
        const supply = await fetchLPTokenSupply(res.poolAddress);
        const poolShare = (res.quantity / supply) * 100;
        const bal0 = await fetchTokenBalance(
          res.token0.address,
          res.poolAddress
        );
        const bal1 = await fetchTokenBalance(
          res.token1.address,
          res.poolAddress
        );
        const x: ExtendedLiquidity = {
          poolAddress: res.poolAddress,
          token0: res.token0,
          token1: res.token1,
          quantity: res.quantity,
          poolShare,

          amount0: (bal0 * poolShare) / 10 ** res.token0.decimals,
          amount1: (bal1 * poolShare) / 10 ** res.token1.decimals
        };
        setUserLiquidity(x);
      }
    };

    fetchLiquidity();
  }, [token0, token1]);

  return (
    <div className='MyLiquidity feature'>
      <div className='my-liquidity'>
        <span>My Liquidity</span>
        <span>Manage your liquidity by removing it or adding more</span>
      </div>
      <div className='container-feature'>
        <div className='liquidity-container'>
          {userLiquidity &&
            (userLiquidity.poolShare === 0 ? (
              <div className='no-liquidity'>No liquidity found</div>
            ) : (
              <div className='liquidity'>
                <div className='thumbail'>
                  <div className='liquidity-info'>
                    <div>
                      <img
                        src={userLiquidity.token0.logoURI}
                        alt='token-logo'
                      />
                      {userLiquidity.token0.symbol}
                      <span>/</span>
                      <img
                        src={userLiquidity.token1.logoURI}
                        alt='token-logo'
                      />
                      {userLiquidity.token1.symbol}
                    </div>
                    <div className='liquidity-quantity'>
                      {userLiquidity.quantity / 10 ** LP_TOKEN_DECIMALS >= 1
                        ? (
                            userLiquidity.quantity /
                            10 ** LP_TOKEN_DECIMALS
                          ).toFixed(2)
                        : userLiquidity.quantity / 10 ** LP_TOKEN_DECIMALS}
                    </div>
                  </div>
                </div>
                <div className='details'>
                  <div className='detail'>
                    <div>
                      <img
                        src={userLiquidity.token0.logoURI}
                        alt='token-logo'
                      />
                      <span>
                        {'Pooled '}
                        {userLiquidity.token0.symbol}
                      </span>
                    </div>
                    <span>{(userLiquidity.amount0 / 100).toFixed(2)}</span>
                  </div>
                  <div className='detail'>
                    <div>
                      <img
                        src={userLiquidity.token1.logoURI}
                        alt='token-logo'
                      />
                      <span>
                        {'Pooled '}
                        {userLiquidity.token1.symbol}
                      </span>
                    </div>
                    {/* <span>{(userLiquidity.amount1 / 100).toFixed(2)}</span> */}
                    <span>{(userLiquidity.amount0 / 100).toFixed(2)}</span>
                  </div>
                  <div className='detail'>
                    <div>Share of pool</div>
                    <span>
                      {userLiquidity.poolShare < 0.01
                        ? '<0.01'
                        : userLiquidity.poolShare.toFixed(2)}
                      %
                    </span>
                  </div>

                  <div className='actions'>
                    <Link
                      to={`/remove/${userLiquidity.token0.address}/${userLiquidity.token1.address}`}
                      state={{ liquidity: userLiquidity }}
                    >
                      <Button variant='outlined' text='Remove' />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyLiquidity;
