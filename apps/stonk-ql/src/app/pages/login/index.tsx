import {
  InfoCircleOutlined,
  KeyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Input, Tooltip, Typography } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './index.module.scss';

const { Title } = Typography;

export const Login = () => {
  return (
    <div className={styles.login}>
      <div className={styles.content}>
        <Title level={2}>
          StonkQL{' '}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </Title>
        <div>
          <Input
            placeholder="Enter your username"
            prefix={<UserOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Extra information">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
        </div>
        <div>
          <Input
            placeholder="Enter your password"
            prefix={<KeyOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Extra information">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
        </div>
        <div>
          <NavLink to="/">
            <Button type="primary" block>
              Enter
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
