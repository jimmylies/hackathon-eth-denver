import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isAddressValid } from 'utils/methods';

const useGetTokensFromURL = () => {
  const [valid, setValid] = useState(true);
  const { token0, token1 } = useParams();

  useEffect(() => {
    if (
      !token0 ||
      !isAddressValid(token0) ||
      !token1 ||
      !isAddressValid(token1)
    )
      setValid(false);
  }, [token0, token1]);

  return { token0, token1, valid };
};

export default useGetTokensFromURL;
