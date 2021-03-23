import appleStock from '@visx/mock-data/lib/mocks/appleStock';
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
  return (
    <div className={styles.home}>
      <div className={styles.title}>
        <Title>Investing</Title>
        <Title>$1,324.56</Title>
      </div>
      <ParentSize>
        {({ width, height }) => (
          <div className={styles.areaChart}>
            <AreaChart
              axis
              data={appleStock}
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
