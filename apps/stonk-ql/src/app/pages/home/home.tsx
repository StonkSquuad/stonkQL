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
      <div className={styles.title}>
        <Title>Investing</Title>
        <Title>$1,324.56</Title>
      </div>
      <ParentSize>
        {({ width, height }) => (
          <AreaChart axis data={appleStock} width={width} height={height} />
        )}
      </ParentSize>
      <div className={styles.portfolio}>
        <Title level={2}>Portfolio</Title>
        <div className={styles.assetList}>
          <div>
            <span>TSLA</span>
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  showTooltip={false}
                  data={appleStock}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
          <div>
            <span>APPL</span>
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  showTooltip={false}
                  data={appleStock}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
          <div>
            <span>DT</span>
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  showTooltip={false}
                  data={appleStock}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
          <div>
            <span>GME</span>
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  showTooltip={false}
                  data={appleStock}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
          <div>
            <span>AMC</span>
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  showTooltip={false}
                  data={appleStock}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
          <div>
            <span>FOO</span>
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  showTooltip={false}
                  data={appleStock}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
