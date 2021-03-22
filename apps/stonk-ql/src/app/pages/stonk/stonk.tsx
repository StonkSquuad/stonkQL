import { gql, useQuery } from '@apollo/client';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Typography } from 'antd';
import React from 'react';
import { useLocation } from 'react-router-dom';
import AreaChart from '../../components/charts/area/area';
import { Loader } from '../../components/loader/loader';
import styles from './stonk.module.scss';

const { Title } = Typography;

export const Stonk = () => {
  const { search } = useLocation();
  const ticker = search.split('?')[1];

  const { loading, error, data } = useQuery(gql`
    {
      stockHistorical(
        stockTicker: "${ticker}"
        startDate: "2021-01-02"
        endDate: "2021-03-01"
      ) {
        date
        close
      }
      stock(stockTicker: "${ticker}") {
        name
      }
    }
  `);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className={styles.stonk}>
        {data && <Title>{data.stock[0].name}</Title>}
        {data && (
          <ParentSize>
            {({ width, height }) => (
              <AreaChart
                data={data.stockHistorical}
                width={width}
                height={height}
              />
            )}
          </ParentSize>
        )}
      </div>
    );
  }
};
export default Stonk;
