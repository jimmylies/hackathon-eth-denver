import { useBearby } from '@hicaru/bearby-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchActiveOrders } from 'utils/datastoreFetcher';
import { tokens } from 'utils/tokens';
import { profile, urqlClient } from 'utils/urql-client';
import SwapCard from './components/SwapCard';
import './index.scss';

const Swap = ({ profile }) => {
  useEffect(() => {
    getServerSideProps();
  });
  console.log(profile);
  const [token0, setToken0] = useState(tokens[0]);
  const [token1, setToken1] = useState(tokens[1]);
  const [invert, setInvert] = useState(false);
  const [displayChart, setDisplayChart] = useState(true);
  const { base58 } = useBearby();

  const { search } = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const { tokenIn, tokenOut } = Object.fromEntries(query);
    if (tokenIn || tokenOut) {
      for (const token of tokens) {
        if (token.address === tokenIn) setToken0(token);
        else if (token.address === tokenOut) setToken1(token);
      }
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const activeOrders = await fetchActiveOrders(base58 || '');
    };

    fetchOrders();
  }, []);

  // const queryExample = async () => {
  //   const response = await urqlClient.query(pingQuery).toPromise();
  //   console.log('Lens example data: ', response);
  // };

  return (
    <div className='Swap'>
      <div className='chart-feature-container'>
        <SwapCard
          token0={token0}
          setToken0={setToken0}
          token1={token1}
          setToken1={setToken1}
          displayChart={displayChart}
          setDisplayChart={setDisplayChart}
          setInvert={setInvert}
        />
      </div>
    </div>
  );
};

export default Swap;

export async function getServerSideProps() {
  const response = await urqlClient.query(profile, '' as any).toPromise();
  console.log(response.data.profile);
  return {
    props: {
      profile: response?.data?.profile
    }
  };
}
