import {
  InfoCircleOutlined,
  KeyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Input, Tooltip } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as RocketLogo } from '../../../assets/rocket-logo.svg';
import { useCtx } from '../../context';
import styles from './login.module.scss';

export const Login = () => {
  const { updateContext } = useCtx();

  return (
    <div className={styles.login}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <RocketLogo />
        </div>
        <div>
          <Input
            placeholder="Enter your username"
            prefix={<UserOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Extra information">
                <InfoCircleOutlined style={{ color: 'rgba(255,255,255,.1)' }} />
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
                <InfoCircleOutlined style={{ color: 'rgba(255,255,255,.1)' }} />
              </Tooltip>
            }
          />
        </div>
        <div>
          <NavLink to="/">
            <Button
              type="primary"
              block
              onClick={() => {
                updateContext({ isLoggedIn: true });
              }}
            >
              Enter
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
