import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Typography } from 'antd';
import React from 'react';
import AreaChart from '../../components/charts/area/area';
import styles from './home.module.scss';

const { Title } = Typography;

export const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.areaChart}>
        <Title>Investments</Title>
        <ParentSize>
          {({ width, height }) => (
            <AreaChart data={undefined} width={width} height={height} />
          )}
        </ParentSize>
      </div>
    </div>
  );
};

export default Home;
