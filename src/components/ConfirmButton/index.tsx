import React, { useEffect, useState } from 'react';
import Button from 'components/Button';
import { fetchUserAllowance } from 'utils/datastoreFetcher';
import { buildIncreaseAllowanceTx } from 'utils/transactionBuilder';
import './index.scss';
import { useBearby } from '@hicaru/bearby-react';
import { useSendTransaction } from 'hooks/useSendTransaction';

interface ConfirmButtonProps {
  tokenAddress: string;
  spender: string;
  value: number;
  text: string;
  sendTx: () => void;
}

const ConfirmButton = ({
  tokenAddress,
  spender,
  value,
  text,
  sendTx
}: ConfirmButtonProps) => {
  const [step, setStep] = useState(0);
  const { base58 } = useBearby();
  const { txHash, isTxPending, txEvents, submitTx } = useSendTransaction({
    data: buildIncreaseAllowanceTx(tokenAddress, spender, 1000000)
  });

  const increaseAllowance = async () => {
    await submitTx();
    setStep((s) => s + 1);
  };

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!base58) return;
      await fetchUserAllowance(tokenAddress, base58, spender).then((res) => {
        res > value && setStep(1);
      });
    };

    fetchAllowance();
  }, []);

  return (
    <div className='ConfirmButton'>
      <Button
        text='Approve'
        disabledText='Approved'
        onClick={increaseAllowance}
        disabled={step === 1}
        variant={step === 0 ? 'contained' : 'outlined'}
      />
      <Button
        text={text}
        disabledText={text}
        onClick={sendTx}
        disabled={step === 0}
        variant={step === 1 ? 'contained' : 'outlined'}
      />
    </div>
  );
};

export default ConfirmButton;
