import React from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.scss';

interface TooltipProps {
  variant?: string;
  title?: string;
  description?: string;
}

const Tooltip = ({ variant, title, description }: TooltipProps) => {
  if (!variant && !title && !description) return <></>;

  return (
    <div className='Tooltip'>
      <span className='title'>
        {variant && variant === 'slippage' ? 'Slippage' : title}
      </span>
      <FontAwesomeIcon className='icon' icon={faInfoCircle} />
      <div className='description'>
        {variant && variant === 'slippage'
          ? 'Your transaction will revert if the price moves unfavorably by more than this percentage.'
          : description}
      </div>
    </div>
  );
};

export default Tooltip;
