import { tokens } from 'utils/tokens';

export interface Pair {
  token0: string;
  token1: string;
}

export const pairs: Pair[] = [
  {
    token0: tokens[0].address,
    token1: tokens[1].address
  }
];
