import { gql, useQuery } from '@apollo/client';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Typography } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import AreaChart from '../../components/charts/area/area';
import PortfolioTile from '../../components/portfolio-tile/portfolio-tile';
import styles from './home.module.scss';

const { Title } = Typography;

const ASSETS = [
  {
    ticker: 'TSLA',
  },
  {
    ticker: 'GME',
  },
  {
    ticker: 'DT',
  },
  {
    ticker: 'AAPL',
  },
  {
    ticker: 'IBM',
  },
  {
    ticker: 'AMC',
  },
];

export const Home = () => {
  const { loading, error, data } = useQuery(gql`
    {
      transactionHistory(
        userName: "cmp11290"
        startDate: "2020-01-01"
        endDate: "2021-03-28"
      ) {
        date
        close
      }
      user(username: "cmp11290") {
        cashValue
        stocksValue
      }
    }
  `);

  const cashValue = data?.user?.cashValue || 0;
  const stocksValue = data?.user?.stocksValue || 0;

  return (
    <div className={styles.home}>
      <div className={styles.title}>
        <Title>Investing</Title>
        <div className={styles.values}>
          <div>Stocks value: ${stocksValue}</div>
          <div>Cash value: ${cashValue}</div>
        </div>
      </div>
      <ParentSize>
        {({ width, height }) => (
          <div className={styles.areaChart}>
            <AreaChart
              axis
              data={data?.transactionHistory}
              width={width}
              height={height}
              tooltipVisible
            />
          </div>
        )}
      </ParentSize>
      <div className={styles.portfolio}>
        <Title level={2}>Portfolio</Title>
        <div className={styles.assetList}>
          {ASSETS.map((asset, key) => (
            <NavLink to={`/stonk?${asset.ticker}`} key={key}>
              <PortfolioTile ticker={asset.ticker} />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
