import { gql, useQuery } from '@apollo/client';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, { memo } from 'react';
import AreaChart from '../../components/charts/area/area';
import styles from './portfolio-tile.module.scss';

interface PortfolioTileProps {
  asset: { ticker: string; quantity: number };
}

export const PortfolioTile = memo(({ asset }: PortfolioTileProps) => {
  const { loading, error, data } = useQuery(gql`
  {
    stockHistorical(
      stockTicker: "${asset.ticker}"
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
      <span>
        {asset.quantity}
        {'   '}
        {asset.ticker}
      </span>
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
