import Tabs from 'components/Tabs';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTokenFromAddress } from 'utils/methods';
import { Token } from 'utils/tokens';
import AddLiquidity from './components/AddLiquidity';
import MyLiquidity from './components/MyLiquidity';
import './index.scss';

const Pool = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [token0, setToken0] = React.useState<Token>();
  const [token1, setToken1] = React.useState<Token>();

  const { poolToken0, poolToken1 } = useParams();

  // useEffect(() => {
  //   if (poolToken0 && poolToken1) {
  //     setToken0(getTokenFromAddress(poolToken0));
  //     setToken1(getTokenFromAddress(poolToken1));
  //   }
  // }, []);

  return (
    <div className='Pool'>
      <div className='infos-pools'>
        <div className='header-infos'>
          <div className='title-header-infos'>
            <div className='title-tokens'>
              <img src={token0?.logoURI} />

              <span>{token0?.symbol}</span>
              <span> / </span>
              <img src={token1?.logoURI} />
              <span>{token1?.symbol}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='container-pools'>
        <Tabs tabs={['Manage']} onClick={setActiveTab} />
        <div className='tabs-container'>
          <div className='tabs-content'>
            {activeTab === 0 && (
              <div className='manage-liquidity'>
                <div className='add-liquidity'>
                  <span>Add Liquidity</span>
                  <span>Provides tokens to earn fees by adding liquidity</span>
                  <AddLiquidity setTokenA={setToken0} setTokenB={setToken1} />
                </div>
                <div className='my-liquidity'>
                  <MyLiquidity />
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div className='analytics'>
                All the analytics of the {token0?.symbol} / {token1?.symbol}{' '}
                pool with be displayed here soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pool;
