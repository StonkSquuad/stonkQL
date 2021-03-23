import { gql, useQuery } from '@apollo/client';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, { memo } from 'react';
import AreaChart from '../../components/charts/area/area';
import styles from './portfolio-tile.module.scss';

interface PortfolioTileProps {
  ticker: string;
}

export const PortfolioTile = memo(({ ticker }: PortfolioTileProps) => {
  const { loading, error, data } = useQuery(gql`
  {
    stockHistorical(
      stockTicker: "${ticker}"
      startDate: "2021-01-02"
      endDate: "2021-03-01"
    ) {
      date
      close
      ticker
    }
  }
`);

  return (
    <div className={styles.portfolioTile}>
      <span>{ticker}</span>
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
});

export default PortfolioTile;
