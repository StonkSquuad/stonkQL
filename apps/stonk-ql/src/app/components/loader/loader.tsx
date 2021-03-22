import { Spin } from 'antd';
import React from 'react';
import styles from './loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <Spin size="large" />
    </div>
  );
};
