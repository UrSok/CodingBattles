import React from 'react';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Router from './routes/Router';
import { menuRoutes } from './routes/menuRoutes';
import AuthBadges from './components/auth/Badges';
import HeaderAlerts from './components/auth/HeaderAlerts';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/auth/selectors';
import { Role } from 'app/api/types/auth';
import { Alert, Button, Space } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { t } = useTranslation();

  return (
    <ProLayout
      title="Coding Battles"
      route={{
        routes: menuRoutes,
      }}
      location={{
        pathname: pathname,
      }}
      fixSiderbar
      fixedHeader
      onMenuHeaderClick={() => navigate('/')}
      menuDataRender={(menuData: MenuDataItem[]): MenuDataItem[] => {
        return menuData;
      }}
      menuItemRender={(item: MenuDataItem, dom) => (
        <Link to={item.path!}>{dom}</Link>
      )}
      rightContentRender={() => <AuthBadges />}
    >
      <Space direction="vertical" size="small" style={{ display: 'flex' }}>
        <HeaderAlerts />
        <Router />
      </Space>
    </ProLayout>
  );
}
