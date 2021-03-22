import { gql, useQuery } from '@apollo/client';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AreaChart from '../../components/charts/area/area';
import { Loader } from '../../components/loader/loader';
import styles from './stonk.module.scss';

const { Title } = Typography;

export const Stonk = () => {
  const { search } = useLocation();
  const ticker = search.split('?')[1];
  const [startDay, setStartDay] = useState(30);

  const dateChange = (days) => {
    setStartDay(days);
  };

  const endDate = moment().format('YYYY-MM-DD');
  const startDate = moment().subtract(startDay, 'd').format('YYYY-MM-DD');

  const { loading, error, data } = useQuery(gql`
    {
      stockHistorical(
        stockTicker: "${ticker}"
        startDate: "${startDate}"
        endDate: "${endDate}"
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
        {data && (
          <div className={styles.title}>
            <Title>{data.stock[0].name}</Title>
            <Title>${data.stockHistorical.slice(-1).pop().close}</Title>
          </div>
        )}
        {data && (
          <ParentSize>
            {({ width, height }) => (
              <AreaChart
                data={data.stockHistorical}
                width={width}
                height={height}
                onDateChange={dateChange}
                days={startDay}
              />
            )}
          </ParentSize>
        )}
      </div>
    );
  }
};
export default Stonk;
