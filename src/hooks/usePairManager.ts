import { useBearby } from '@hicaru/bearby-react';
import { WalletContext } from 'context/WalletContext';
import React, { useContext, useEffect, useState } from 'react';
import { routerSC } from 'utils/config';
import {
  fetchPairAddress,
  fetchTokenBalance,
  fetchTokenPrice,
  getAmountOut,
  getAmountIn,
  fetchUserAllowance
} from 'utils/datastoreFetcher';
import { Token } from 'utils/tokens';
import { customerAccount } from 'utils/w3';

interface PairManagerProps {
  token0: Token;
  setToken0: React.Dispatch<React.SetStateAction<Token>>;
  token1: Token;
  setToken1: React.Dispatch<React.SetStateAction<Token>>;
}

const usePairManager = ({
  token0,
  setToken0,
  token1,
  setToken1
}: PairManagerProps) => {
  const [balance0, setBalance0] = useState(0);
  const [balance1, setBalance1] = useState(0);
  const [quantity0, setQuantity0] = useState(0);
  const [quantity1, setQuantity1] = useState(0);
  const [price, setPrice] = useState(-1);
  const [priceImpact, setPriceImpact] = useState(0);
  const [pairAddress, setPairAddress] = useState('');
  const [dollarValue, setDollarValue] = useState(0);
  const [userAllowance0, setUserAllowance0] = useState(0);
  const [userAllowance1, setUserAllowance1] = useState(0);

  const { base58 } = useBearby();
  const { account } = useContext(WalletContext);

  const connected = !!account?.address; // !!base58;
  const userAddress = account?.address || ''; // base58 || '';

  const changeQuantityWithPriceImpact = async (
    quantity: number,
    isToken0: boolean,
    customPrice?: number
  ) => {
    const calculPrice = customPrice || price;
    if (quantity > 0) {
      if (isToken0) {
        setQuantity0(quantity);
        const res = await getAmountOut(
          pairAddress,
          token0.address,
          token1.address,
          quantity
        );
        const difference = calculPrice - res / quantity;
        const impact = (difference / calculPrice) * 100 - 0.3; // fees
        setPriceImpact(impact);
        setQuantity1(res);
      } else {
        setQuantity1(quantity);
        const res = await getAmountIn(
          pairAddress,
          customPrice ? token0.address : token1.address,
          customPrice ? token1.address : token0.address,
          quantity
        );
        const difference = calculPrice - quantity / res;
        const impact = (difference / calculPrice) * 100 - 0.3; // fees
        setPriceImpact(impact);
        setQuantity0(res);
      }
    } else {
      if (isToken0) {
        setQuantity0(quantity);
        setQuantity1(NaN);
      } else {
        setQuantity1(quantity);
        setQuantity0(NaN);
      }
    }
  };

  const changeQuantityWithFixedPrice = (
    quantity: number,
    isToken0: boolean
  ) => {
    if (isToken0) {
      setQuantity0(quantity);
      setQuantity1(quantity * price);
    } else {
      setQuantity1(quantity);
      setQuantity0(quantity / price);
    }
  };

  const changeQuantityAlone = (quantity: number, isToken0: boolean) => {
    isToken0 ? setQuantity0(quantity) : setQuantity1(quantity);
  };

  const changeToken = (token: Token, isToken0: boolean) => {
    if (isToken0)
      if (token.address === token1.address) invertTokens();
      else {
        fetch(token.address, token1.address);
        setToken0(token);
      }
    else if (token.address === token0.address) invertTokens();
    else {
      fetch(token0.address, token.address);
      setToken1(token);
    }
  };

  const invertTokens = async () => {
    changeQuantityWithPriceImpact(quantity0, false, 1 / price);
    setPrice(1 / price);
    setToken0(token1);
    setToken1(token0);
    setBalance0(balance1);
    setBalance1(balance0);
  };

  const fetchBalances = async (
    token0Address?: string,
    token1Address?: string
  ) => {
    setQuantity0(NaN);
    setQuantity1(NaN);
    if (connected) {
      const token0Balance = await fetchTokenBalance(
        token0Address ?? token0.address,
        userAddress
      );
      setBalance0(token0Balance);
      const token1Balance = await fetchTokenBalance(
        token1Address ?? token1.address,
        userAddress
      );
      setBalance1(token1Balance);
    }
  };

  const fetchPrice = async (token0Address?: string, token1Address?: string) => {
    const t0Address = token0Address ? token0Address : token0.address;
    const t1Address = token1Address ? token1Address : token1.address;
    const lpAddress = await fetchPairAddress(t0Address, t1Address);
    if (!lpAddress) {
      setPrice(-1);
      return;
    }
    const ratio = await fetchTokenPrice(lpAddress, t0Address, t1Address);
    setPairAddress(lpAddress);
    setPrice(ratio);
  };

  const fetchDollarValue = async () => {
    setTimeout(() => setDollarValue(Math.random() * 10), 5000);
  };

  const fetch = (token0Address?: string, token1Address?: string) => {
    fetchBalances(token0Address, token1Address);
    token0Address ? fetchPrice(token0Address, token1Address) : fetchPrice();
    fetchDollarValue();
  };

  useEffect(() => {
    fetch();
  }, []);

  return {
    balance0,
    balance1,
    dollarValue,
    quantity0,
    quantity1,
    price,
    priceImpact,
    pairAddress,
    userAllowance0,
    userAllowance1,
    changeQuantityWithPriceImpact,
    changeQuantityWithFixedPrice,
    changeQuantityAlone,
    changeToken,
    fetchBalances,
    fetchPrice,
    invertTokens
  };
};

export default usePairManager;
