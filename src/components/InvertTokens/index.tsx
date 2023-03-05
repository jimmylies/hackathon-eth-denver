import React from 'react';
import {
  faArrowDown,
  faArrowRightArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.scss';

const InvertTokens = ({ handleInvert }) => {
  const handleEnter = (event: React.MouseEvent) => {
    event.currentTarget.children[0].classList.add('hidden');
    event.currentTarget.children[1].classList.remove('hidden');
  };

  const handleLeave = (event: React.MouseEvent) => {
    event.currentTarget.children[0].classList.remove('hidden');
    event.currentTarget.children[1].classList.add('hidden');
  };

  return (
    <div
      className='InvertTokens'
      onClick={handleInvert}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <FontAwesomeIcon icon={faArrowDown} />
      <FontAwesomeIcon
        icon={faArrowRightArrowLeft}
        rotation={90}
        className='hidden'
      />
    </div>
  );
};

export default InvertTokens;
