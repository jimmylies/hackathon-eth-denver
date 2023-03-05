import { Args, CallSmartContractParams } from '@hicaru/bearby.js';
import { ICallData } from '@massalabs/massa-web3';
import { limitOrderSC, routerSC } from './config';
import { Token } from './tokens';

const callData: ICallData = {
  coins: 0,
  targetAddress: routerSC,
  functionName: '',
  parameter: [],
  fee: 0,
  maxGas: 70000000
};

// ==================================================== //
// ====                    SWAP                    ==== //
// ==================================================== //

export const buildSwapTx = (
  tokenIn: string,
  tokenOut: string,
  amountIn: number,
  amountOutMin: number
): ICallData => {
  const args = new Args()
    .addString(tokenIn)
    .addString(tokenOut)
    .addU64(isNaN(amountIn) ? 0 : amountIn)
    .addU64(isNaN(amountOutMin) ? 0 : amountOutMin);

  return {
    ...callData,
    functionName: 'swapExactTokensForTokens',
    parameter: args.serialize()
  };
};

// ==================================================== //
// ====                ADD LIQUIDITY               ==== //
// ==================================================== //

export const buildAddLiquidityTx = (
  token0: Token,
  token1: Token,
  token0Amount: number,
  token1Amount: number
): ICallData => {
  const minAmount = 0;
  let args = new Args()
    .addString(token0.address)
    .addString(token1.address)
    .addU64(isNaN(token0Amount) ? 0 : parseInt(token0Amount.toString()))
    .addU64(isNaN(token1Amount) ? 0 : parseInt(token0Amount.toString()))
    .addU64(minAmount)
    .addU64(minAmount);

  return {
    ...callData,
    functionName: 'addLiquidity',
    parameter: args.serialize()
  };
};

// ==================================================== //
// ====              REMOVE LIQUIDITY              ==== //
// ==================================================== //

export const buildRemoveLiquidityTx = (
  tokenA: string,
  tokenB: string,
  amount: number
): CallSmartContractParams => {
  const args = new Args().addString(tokenA).addString(tokenB).addU64(amount);

  return {
    ...callData,
    functionName: 'removeLiquidity',
    parameter: args
  };
};

// ==================================================== //
// ====             INCREASE ALLOWANCE             ==== //
// ==================================================== //

export const buildIncreaseAllowanceTx = (
  token: string,
  spender: string,
  amount: number
): CallSmartContractParams => {
  const args = new Args().addString(spender).addU64(isNaN(amount) ? 0 : amount);

  return {
    ...callData,
    targetAddress: token,
    functionName: 'increaseAllowance',
    parameter: args.serialize()
  };
};

// ==================================================== //
// ====                  ADD ORDER                 ==== //
// ==================================================== //

export const buildAddOrderTx = (
  tokenIn: string,
  tokenOut: string,
  amount: number,
  price: number
): CallSmartContractParams => {
  const args = [tokenIn, tokenOut, amount.toString(), price.toString()].join(
    '#'
  );

  return {
    ...callData,
    targetAddress: limitOrderSC,
    functionName: 'addLimitOrder'
  };
};

// ==================================================== //
// ====                REMOVE ORDER                ==== //
// ==================================================== //

export const buildRemoveOrderTx = (index: number): CallSmartContractParams => {
  const args = index.toString();

  return {
    ...callData,
    targetAddress: limitOrderSC,
    functionName: 'removeLimitOrder'
  };
};

// ==================================================== //
// ====                    FAUCET                  ==== //
// ==================================================== //

export const buildFaucetTx = (
  tokenAddress: string,
  receiver: string
): ICallData => {
  const args = new Args().addString(receiver).addU64(1000000000000);

  return {
    targetAddress: tokenAddress,
    functionName: 'transfer',
    parameter: args.serialize(),
    fee: 0,
    maxGas: 70000000,
    coins: 0
  };
};
