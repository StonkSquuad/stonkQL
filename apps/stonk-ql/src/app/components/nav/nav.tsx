import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { gql, useLazyQuery } from '@apollo/client';
import { Spin } from 'antd';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as RocketLogo } from '../../../assets/rocket-logo.svg';
import styles from './nav.module.scss';

export const Nav = () => {
  const [searchOpen, toggleSearchOpen] = useState(false);
  const [resultsOpen, toggleResultsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [getResults, { loading, data }] = useLazyQuery(gql`
    {
      stock(stockTicker: "${searchValue}") {
        ticker
        name
      }
    }
  `);

  const onSearchChange = (event) => {
    if (event.target.value) {
      getResults();
      toggleResultsOpen(true);
    } else {
      toggleResultsOpen(false);
    }
    setSearchValue(event.target.value);
  };

  const closeSearch = () => {
    toggleSearchOpen(!searchOpen);
    toggleResultsOpen(false);
    setSearchValue('');
  };

  return (
    <div className={styles.nav}>
      <div className={styles.logo}>
        <NavLink to="/">
          <RocketLogo />
        </NavLink>
      </div>
      <div className={styles.search}>
        {!searchOpen ? (
          <SearchOutlined
            onClick={() => {
              toggleSearchOpen(!searchOpen);
            }}
          />
        ) : (
          <CloseOutlined
            onClick={() => {
              closeSearch();
            }}
          />
        )}
        <input
          className={searchOpen ? styles.open : null}
          ref={(input) => input && input.focus()}
          type="text"
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Ticker or company name"
        ></input>
        <div
          className={[
            styles.searchResults,
            resultsOpen ? styles.open : null,
          ].join(' ')}
        >
          {loading ? (
            <div className={styles.loader}>
              <Spin />
            </div>
          ) : (
            <ul>
              {data &&
                data.stock.map((result, key) => (
                  <li
                    key={key}
                    onClick={() => {
                      closeSearch();
                    }}
                  >
                    <NavLink to={`/stonk?${result.ticker}`}>
                      <span>{result.ticker}</span>
                      <div>{result.name}</div>
                    </NavLink>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
