import React from 'react';
import './index.scss';

interface ButtonProps {
  text: string;
  variant?: 'contained' | 'outlined';
  onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  disabledText?: string | false;
}

const Button = ({
  text,
  variant,
  onClick,
  disabled,
  disabledText
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`Button ${variant && variant}`}
      onClick={onClick}
    >
      {disabled && disabled ? disabledText : text}
    </button>
  );
};

export default Button;
