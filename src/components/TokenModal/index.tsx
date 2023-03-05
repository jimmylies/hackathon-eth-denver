import React, { useEffect, useRef, useState } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/Button';
// import { fetchTokenInfo } from 'utils/datastoreFetcher';
import { getImportedTokens, isAddressValid } from 'utils/methods';
import { Token, tokens } from 'utils/tokens';
import './index.scss';

const TokenModal = ({ activeToken, changeActiveToken, showModal }) => {
  const [results, setResults] = useState<Token[]>();
  const [importedTokens, setImportedTokens] = useState<Token[]>(() => {
    const x = getImportedTokens();
    return x.length > 0 ? x : [];
  });

  const background = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const overflow = () => {
    showModal(false);
    document.body.style.overflow = 'auto';
  };

  // const performSearch = async (search: string) => {
  //   if (search !== '') {
  //     if (isAddressValid(search)) {
  //       const token = await fetchTokenInfo(search);
  //       if (token) setResults([token]);
  //     } 
  //     // else {
  //     //   setResults(
  //     //     extendedTokens.filter(
  //     //       (token) =>
  //     //         (token.name.toLowerCase().startsWith(search.toLowerCase()) ||
  //     //           token.symbol.toLowerCase().startsWith(search.toLowerCase())) &&
  //     //         !importedTokens.some(
  //     //           (importedToken) => importedToken.address === token.address
  //     //         )
  //     //     )
  //     //   );
  //     // }
  //   } else setResults(undefined);
  // };

  const renderTokenList = () => {
    return (
      <div className='token-list'>
        {tokens
          .concat(importedTokens)
          .sort((a, b) =>
            a.symbol.toUpperCase() < b.symbol.toUpperCase() ? -1 : 1
          )
          .sort((a) => (['WMAS', 'DUSA', 'USDC'].includes(a.symbol) ? -1 : 1))
          .map((token, index) => {
            return (
              <div
                className={`token ${activeToken === token ? 'active' : ''}`}
                key={index}
                style={{ cursor: `${activeToken === token ? 'inherit' : ''}` }}
                onClick={() => {
                  if (activeToken !== token) {
                    changeActiveToken(token);
                    overflow();
                  }
                }}
              >
                <div>
                  <img src={token.logoURI} alt='logo' />
                  <div className='token-info'>
                    <span>{token.symbol}</span>
                    <span className='nowrap'>
                      {!tokens.includes(token) && 'Added by user • '}
                      {token.name}
                    </span>
                  </div>
                </div>
                {!tokens.includes(token) && (
                  <FontAwesomeIcon
                    icon={faXmark}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newImportedTokens = importedTokens.filter(
                        (t: Token) => t.address !== token.address
                      );
                      setImportedTokens(newImportedTokens);
                      localStorage.setItem(
                        'importedTokens',
                        JSON.stringify(newImportedTokens)
                      );
                    }}
                  />
                )}
              </div>
            );
          })}
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className='token-list'>
        {results &&
          results.map((result, index) => {
            return (
              <div className='token result-token' key={index}>
                <img src={result.logoURI} alt='logo' />
                <div className='result-token-info'>
                  <span>{result.symbol}</span>
                  <span className='nowrap'>{result.name}</span>
                </div>
                <Button
                  text={'Import'}
                  variant='contained'
                  onClick={() => {
                    importedTokens.push(result);
                    localStorage.setItem(
                      'importedTokens',
                      JSON.stringify(importedTokens)
                    );
                    setResults(undefined);
                    input.current!.value = '';
                  }}
                />
              </div>
            );
          })}
        {results && results.length === 0 && <div>No results found.</div>}
      </div>
    );
  };

  return (
    <div className='TokenModal'>
      <div
        className='TokenModal-background'
        ref={background}
        onClick={(e) => {
          if (background.current === e.target) overflow();
        }}
      >
        <div className='TokenModal-container'>
          <div className='top'>
            <div>Select a token</div>
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => {
                overflow();
              }}
            />
          </div>
          <div className='TokenModal-content'>
            <input
              ref={input}
              type='text'
              placeholder='Search name or paste address'
              // onChange={(e) => performSearch(e.target.value)}
            />
            {!results && renderTokenList()}
            {results && renderResults()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
