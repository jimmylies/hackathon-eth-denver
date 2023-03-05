import React, { useContext, useEffect, useState } from 'react';
import { useBearby } from '@hicaru/bearby-react';
import { toast } from 'react-toastify';
import { fetchTx, fetchTxEvents } from 'utils/datastoreFetcher';
import { CallSmartContractParams } from '@hicaru/bearby.js';
import { ICallData } from '@massalabs/massa-web3';
import { baseAccount, baseClient, customerClient } from 'utils/w3';
import { WalletContext } from 'context/WalletContext';

function isICallData(object: any): object is ICallData {
  return !('gasPrice' in object);
}

interface SendTransactionProps {
  data: CallSmartContractParams | ICallData;
}

export const useSendTransaction = ({ data }: SendTransactionProps) => {
  const [txHash, setTxHash] = useState<string>();
  // const [txError, setTxError] = useState<string>();
  const [isTxPending, setIsTxPending] = useState(false);
  const [txEvents, setTxEvents] = useState<string[]>();
  const { contract, wallet, base58 } = useBearby();

  const { account } = useContext(WalletContext);

  const submitTx = async (isPending?) => {
    // console.log(base58);
    // if (!base58) {
    //   await wallet.connect();
    // }

    const txIdProm = isICallData(data)
      ? customerClient.smartContracts().callSmartContract(data)
      : contract.call(data);

    if (isPending !== false) setIsTxPending(true);

    console.log(data);

    await txIdProm
      .then(async (txId) => {
        setTxHash(txId);
        console.log(txId);
        if (isPending !== false) {
          await processTx(txId, data.functionName).then(() =>
            setIsTxPending(false)
          );
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Transaction failed');
        setIsTxPending(false);
      });
  };

  const processTx = async (txId: string, title: string): Promise<any> => {
    const pending = toast.loading(`Processsing ${title}...`, {
      autoClose: false
    });
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        // TODO: use EventPoller
        const tx = await fetchTx(txId);
        if (tx && tx[0].is_final) {
          clearInterval(interval);
          toast.dismiss(pending);
          toast.success('Transaction successful');
          resolve(tx);
          await fetchTxEvents(txId).then((events) => {
            setTxEvents(events);
            console.log(events);
          });
        }
      }, 1000);
    });
  };

  return { /*txError,*/ txHash, isTxPending, txEvents, submitTx };
};
