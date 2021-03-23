import { gql, useLazyQuery, useQuery } from '@apollo/client';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { notification, Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AreaChart from '../../components/charts/area/area';
import { Loader } from '../../components/loader/loader';
import TradeDialog from '../../components/trade-dialog/trade-dialog';
import { DATE_OPTIONS } from './date-options';
import styles from './stonk.module.scss';

const { Title } = Typography;

export const Stonk = () => {
  const { search } = useLocation();
  const ticker = search.split('?')[1];
  const [startDay, setStartDay] = useState(30);
  const endDate = moment().format('YYYY-MM-DD');
  const startDate = moment().subtract(startDay, 'd').format('YYYY-MM-DD');
  const [buyDialog, toggleBuyDialog] = useState(false);
  const [buyAmount, setBuyAmount] = useState(1);
  const [sellDialog, toggleSellDialog] = useState(false);
  const [sellAmount, setSellAmount] = useState(1);

  const { loading, error, data } = useQuery(gql`
    {
      stockHistorical(
        stockTicker: "${ticker}"
        startDate: "${startDate}"
        endDate: "${endDate}"
      ) {
        date
        close
        ticker
      }
      stock(stockTicker: "${ticker}") {
        name
      }
      getOwnedStockForTicker( userName: "cmp11290", ticker:"${ticker}" ) {
        stocksOwned
      }
    }
  `);

  const [buyStonks] = useLazyQuery(gql`
    {
      buyStock(userName:"cmp11290",stockTicker:"${ticker}",quantity:${buyAmount}){
        totalStockValue,
        totalCashValue,
        currentPrice,
        ticker
      }
    }
  `);
  const [sellStonks] = useLazyQuery(gql`
    {
      sellStock(userName:"cmp11290",stockTicker:"${ticker}",quantity:${sellAmount}){
        totalStockValue,
        totalCashValue,
        currentPrice,
        ticker
      }
    }
  `);

  const openNotification = (type, count) => {
    const args = {
      message: 'Confirmation of trade',
      description: `You have successfully ${type} ${count} shares of ${ticker}.`,
      duration: 0,
    };
    notification.open(args);
  };

  const dateChange = (days) => {
    setStartDay(days);
  };

  const handleBuy = (shares) => {
    toggleBuyDialog(false);
    setBuyAmount(shares);
    buyStonks();
    openNotification('bought', shares);
  };
  const handleSell = (shares) => {
    toggleSellDialog(false);
    setSellAmount(shares);
    sellStonks();
    openNotification('sold', shares);
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className={styles.stonk}>
        {data && (
          <div className={styles.title}>
            <div>
              <Title>{data.stock[0].name}</Title>
              <div>
                You own{' '}
                {data ? data?.getOwnedStockForTicker?.stocksOwned : 'N/A'}{' '}
                shares
              </div>
            </div>
            <div className={styles.rightSide}>
              <Title>${data.stockHistorical.slice(-1).pop().close}</Title>
              <div>Current price</div>
            </div>
          </div>
        )}
        {data && (
          <>
            <ParentSize>
              {({ width, height }) => (
                <div className={styles.areaChart}>
                  <AreaChart
                    data={data.stockHistorical}
                    width={width}
                    height={height}
                    axis
                    tooltipVisible
                  />
                </div>
              )}
            </ParentSize>
            <div className={styles.actions}>
              <div className={styles.dates}>
                {DATE_OPTIONS.map((option, key) => (
                  <div
                    className={startDay === option.value ? styles.active : null}
                    key={key}
                    onClick={() => {
                      dateChange(option.value);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
              <div className={styles.trade}>
                <div className={styles.red}>
                  {buyDialog && (
                    <div className={styles.dialog}>
                      <TradeDialog onChange={handleBuy} />
                    </div>
                  )}
                  <span
                    className={styles.label}
                    onClick={() => {
                      toggleBuyDialog(!buyDialog);
                      toggleSellDialog(false);
                    }}
                  >
                    Buy
                  </span>
                </div>
                <div className={styles.green}>
                  {sellDialog && (
                    <div className={styles.dialog}>
                      <TradeDialog onChange={handleSell} />
                    </div>
                  )}
                  <span
                    className={styles.label}
                    onClick={() => {
                      toggleSellDialog(!sellDialog);
                      toggleBuyDialog(false);
                    }}
                  >
                    Sell
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
};
export default Stonk;
