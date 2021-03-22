import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Typography } from 'antd';
import React from 'react';
import { ReactComponent as RocketLogo } from '../../../assets/rocket-logo.svg';
import AreaChart from './area';
import styles from './index.module.scss';
const { Title } = Typography;

export const Home = () => {
  return (
    <>
      <div className={styles.nav}>
        <RocketLogo />
      </div>
      <div className={styles.content}>
        <div className={styles.areaChart}>
          <Title>Investments</Title>
          <ParentSize>
            {({ width, height }) => <AreaChart width={width} height={height} />}
          </ParentSize>
        </div>
      </div>
    </>
  );
};

export default Home;
