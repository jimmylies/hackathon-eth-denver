export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
}

export const tokens: Token[] = [
  {
    name: 'Matic',
    symbol: 'MATIC',
    address: 'A12wNqieFh2xaAfbXUjPUAM5QNdNuTWc2tiMiYNZ9JkX97G8uC23',
    decimals: 9,
    logoURI: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912'
  },
  {
    name: 'Dusa Token',
    symbol: 'DUSA',
    address: 'A1tj17bLAuAzKPR9rTLJEn4Ut9ycz5LnRZNw4dz49k11Dpcbajr',
    decimals: 9,
    logoURI:
      'https://dusa.io/_next/image?url=%2Fimages%2Fdusa%2Flogo.png&w=96&q=75'
  },
  // {
  //   name: 'Binance Pegged DAI',
  //   symbol: 'DAI',
  //   address: 'A12UteqAjFL1BKSxJDgGTjRHjWhSErprQ3HAM9o3cZnmbzoHQFVd',
  //   decimals: 18,
  //   logoURI:
  //     'https://tokens.pancakeswap.finance/images/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3.png'
  // },
  // {
  //   name: 'PancakeSwap Token',
  //   symbol: 'CAKE',
  //   address: 'A12GAaeKEtq5GbGp31s3KUKwYRbfdSMEx2gQyFZktL4bSU4Uhfzy',
  //   decimals: 18,
  //   logoURI:
  //     'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png'
  // },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: 'A1XMr3RKoE6Fq9mPqwFpfMcZz2R95Um9GmCFEvUvxdGW1UzYHNB',
    decimals: 9,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png'
  }
];
