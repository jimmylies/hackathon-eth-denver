import React from 'react';
import './index.scss';

const Toggle = ({ setOn }) => {
  const toggle = () => setOn((prevState: boolean) => !prevState);

  return (
    <label className='Toggle'>
      <input type='checkbox' onChange={toggle} />
      <span className='slider' />
    </label>
  );
};

export default Toggle;
