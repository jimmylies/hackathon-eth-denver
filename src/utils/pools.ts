import { Token, tokens } from 'utils/tokens';

interface Pool {
  token0: Token;
  token1: Token;
  liquidity: number;
  volume: number;
  fees: number;
  apr: number;
}

interface poolOwner {
  token0: Token;
  token1: Token;
  balance: number;
  value: number;
}

export const pools: Pool[] = [
  {
    token0: tokens[0],
    token1: tokens[2],
    liquidity: 156202,
    volume: 5453201,
    fees: 12532,
    apr: 25
  },
  {
    token0: tokens[0],
    token1: tokens[1],
    liquidity: 124453,
    volume: 2323211,
    fees: 21324,
    apr: 37
  },
  {
    token0: tokens[1],
    token1: tokens[2],
    liquidity: 232053,
    volume: 1532321,
    fees: 11532,
    apr: 110
  }
];

export const myPools: poolOwner[] = [
  {
    token0: tokens[1],
    token1: tokens[2],
    balance: 12123,
    value: 7134
  }
];
