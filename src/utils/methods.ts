import { Token, tokens } from './tokens';

export const round = (x: number) => Math.round(x * 100) / 100;

export const isAddressValid = (address: string) =>
  address.startsWith('A1') && (address.length === 52 || address.length === 51);

export const printAddress = (address: string) =>
  `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;

export const getSlippage = () =>
  parseFloat(localStorage.getItem('slippage') ?? '0.5');

export const getImportedTokens = (): Token[] =>
  JSON.parse(localStorage.getItem('importedTokens') ?? '[]');

export const getTokenFromAddress = (address: string): Token => {
  return (
    tokens.find((token) => token.address === address) ||
    getImportedTokens().find((token) => token.address === address) || {
      name: 'undefined',
      symbol: 'undefined',
      address: '',
      decimals: 1,
      logoURI:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrDzx8UG4h3ABzbSmoLC7HCG3ixWufCMkFcQ&usqp=CAU'
    }
  );
};
