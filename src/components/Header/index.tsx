import { Link, NavLink } from 'react-router-dom';
// import DarkMode from 'components/DarkMode';
import WalletConnect from 'components/WalletConnect';
import useMAS from 'hooks/useMAS';
import './index.scss';
import Threads from 'components/Threads';

const Header = () => {
  const masPrice = useMAS();

  return (
    <header className='Header'>
      <div className='link-pages'>
        <Link to='/' className='logo-link'>
          <img
            src={
              'https://dusa.io/_next/image?url=%2Fimages%2Fdusa%2Flogo.png&w=96&q=75'
            }
            alt='logo'
          />
          <span>Dusa</span>
        </Link>
        <nav>
          {[
            { name: 'Swap', route: 'swap' },
            { name: 'Add Liquidity', route: 'addliquidity' }
          ].map((route, index: number) => {
            // Add Earn
            return (
              <NavLink
                key={index}
                to={`/${route.route.toLowerCase()}`}
                className='link-page'
              >
                {route.name}
              </NavLink>
            );
          })}
          {/* {windowWidth <= 1200 && (
            <div className='other'>
              <FontAwesomeIcon icon={faEllipsis} />
              <div className='other-dropdown'>
                {[
                  { title: 'Analytics', link: 'https://analytics.dusa.io' },
                  { title: 'Documentation', link: 'https://docs.dusa.io' },
                  { title: 'Governance', link: 'https://gov.dusa.io' }
                ].map((route, index: number) => {
                  return (
                    <a
                      key={index}
                      href={route.link}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {route.title}
                    </a>
                  );
                })}
              </div>
            </div>
          )} */}
        </nav>
      </div>

      <div className='utils'>
        {/* <a
          href={`/swap?tokenOut=${tokens[1].address}`}
          target='_blank'
          rel='noreferrer'
          className='buy-dusa'
        >
          <img src={tokens[1].logoURI} alt='logo' />
          <span>${masPrice && masPrice.toFixed(2)}</span>
        </a> */}
        {/* <DarkMode /> */}
        <Threads />
        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;
