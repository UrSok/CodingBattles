import React from 'react';
import {
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Alert, Avatar, Dropdown, Menu, Space } from 'antd';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/slices/auth/selectors';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { translations } from 'locales/translations';

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        <ProfileOutlined /> My profile
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        <SettingOutlined /> Settings
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        <LogoutOutlined /> Sign out
      </a>
    </Menu.Item>
  </Menu>
);

export default function ProfileBadge(props) {
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  return (
    <>
      <Dropdown
        overlay={menu}
        placement="bottomLeft"
        {...props}
        trigger={['click']}
      >
        <Space>
          {user?.username}
          <Avatar shape="square" size="default" icon={<UserOutlined />} />
          <DownOutlined />
        </Space>
      </Dropdown>
    </>
  );
}
