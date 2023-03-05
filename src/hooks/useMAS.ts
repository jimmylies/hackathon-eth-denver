import { useEffect, useState } from 'react';

const useMAS = () => {
  const [price, setPrice] = useState<number>();

  useEffect(() => {
    const fetchPrice = async () => {
      // await fetch...
      setPrice(3.19);
    };

    fetchPrice();
  }, []);

  return price;
};

export default useMAS;
