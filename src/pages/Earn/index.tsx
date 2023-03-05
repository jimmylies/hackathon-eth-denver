import React, { useState } from 'react';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Button from 'components/Button';
import { pools } from '../../utils/pools';
import './index.scss';

const Earn = () => {
  const [opened, setOpened] = useState<boolean[]>(
    Array.from(Array(pools.length), () => false)
  );

  return (
    <div className='Earn'>
      <div className='feature'>
        <div className='header-feature'>
          <h2>Earn</h2>
        </div>
        <div className='container-pool'>
          {pools.map((pool, index) => {
            return (
              <div
                className='pool'
                key={index}
                onClick={() => {
                  const copy = [...opened];
                  copy[index] = !copy[index];
                  setOpened(copy);
                }}
              >
                <div className='pool-info'>
                  <div className='token-pair'>
                    <img src={pool.token0.logoURI} alt='token-logo' />
                    {pool.token0.symbol}
                    <span>/</span>
                    <img src={pool.token1.logoURI} alt='token-logo' />
                    {pool.token1.symbol}
                  </div>
                  <span>
                    {pool.token0.symbol}-{pool.token1.symbol}
                  </span>
                  <span>APR: {pool.apr}%</span>
                  <FontAwesomeIcon icon={opened[index] ? faMinus : faPlus} />
                </div>
                {opened[index] && (
                  <div className='pool-action'>
                    <Link
                      to={`/swap?tokenIn=${pool.token0.address}&tokenOut=${pool.token1.address}`}
                    >
                      <Button text={'Swap'} variant='outlined' />
                    </Link>
                    <Link
                      to={`/pools?tokenIn=${pool.token0.address}&tokenOut=${pool.token1.address}`}
                    >
                      <Button text={'+ Add'} variant='outlined' />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Earn;
