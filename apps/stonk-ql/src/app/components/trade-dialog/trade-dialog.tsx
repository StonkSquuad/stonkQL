import { SendOutlined } from '@ant-design/icons';
import { Button, InputNumber } from 'antd';
import React, { useState } from 'react';
import styles from './trade-dialog.module.scss';

interface TradeDialogProps {
  onChange: (shares: number) => void;
}
export const TradeDialog = (props: TradeDialogProps) => {
  const [shares, setShares] = useState(1);
  return (
    <div className={styles.tradeDialog}>
      <div className={styles.title}>Number of shares</div>
      <div className={styles.actions}>
        <InputNumber
          size="large"
          min={1}
          max={100000}
          value={shares}
          onChange={(e) => setShares(e)}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          size="large"
          onClick={() => props.onChange(shares)}
        />
      </div>
    </div>
  );
};

export default TradeDialog;
