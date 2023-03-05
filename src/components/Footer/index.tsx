import React from 'react';
import {
  faTwitter,
  faTelegram,
  faMedium,
  faGithub,
  faDiscord
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import './index.scss';

const Footer = () => {
  return (
    <footer>
      <div className='top'>
        <div className='info'>
          <Link to='/' className='logo-link'>
            <img
              src={
                'https://dusa.io/_next/image?url=%2Fimages%2Fdusa%2Flogo.png&w=96&q=75'
              }
              alt='logo'
            />
            <span>Dusa</span>
            <span>protocol</span>
          </Link>
          <div className='description'>
            AMM with an autonomous liquidity powered by the use of autonomous
            smart-contracts & an on-chain education with threads on Lens.
          </div>
        </div>
      </div>
      <div className='bottom'>© Dusa Protocol 2023</div>
    </footer>
  );
};

export default Footer;
