import appleStock from '@visx/mock-data/lib/mocks/appleStock';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Typography } from 'antd';
import React from 'react';
import AreaChart from '../../components/charts/area/area';
import styles from './home.module.scss';

const { Title } = Typography;

export const Home = () => {
  return (
    <div className={styles.home}>
      <Title>Investments</Title>
      <ParentSize>
        {({ width, height }) => (
          <AreaChart
            data={appleStock}
            width={width}
            height={height}
            days={30}
          />
        )}
      </ParentSize>
    </div>
  );
};

export default Home;
