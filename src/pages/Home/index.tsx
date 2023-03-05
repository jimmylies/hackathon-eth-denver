import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import landing from 'assets/img/landing.png';
import Button from 'components/Button';
import './index.scss';
import Footer from 'components/Footer';

const Home = () => {
  return (
    <div className='Home'>
      <header className='HomeHeader'>
        <Link to='/' className='logo-link'>
          <img
            src={
              'https://dusa.io/_next/image?url=%2Fimages%2Fdusa%2Flogo.png&w=96&q=75'
            }
            alt='logo'
          />
          <span>Dusa</span>
        </Link>
      </header>
      <div className='hero'>
        <div className='left'>
          <h1>Trade tokens in one click.</h1>
          <h4>The first decentralized trading protocol on Massa</h4>
          <div className='action'>
            <Link to='/swap'>
              <Button variant='contained' text='Launch App' />
            </Link>
            <Link to='/'>
              <Button variant='outlined' text='Learn more' />
            </Link>
          </div>
        </div>
        <div className='right'>
          <img src={landing} alt='cryptocurrencies' />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
