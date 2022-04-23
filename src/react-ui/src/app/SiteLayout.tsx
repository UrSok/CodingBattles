import React from 'react';
import { Alert, Button, Descriptions, Input, Result, Space, Statistic } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import ProLayout, { MenuDataItem, PageContainer } from '@ant-design/pro-layout';
import { defaultProps } from './components/CustomLayout/_defaultProps';
import { useSelector } from 'react-redux';
import { selectAuth } from './slices/auth/selectors';
import { ProfileBadge, AuthBadge } from './components/auth/Badges';
import HeaderContent from './components/HeaderContent';
import Router from './routes';
import { proLayoutRoutes } from './routes/proLayoutRoutes';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Role } from './slices/auth/types';
import LoadingSpinner from './components/LoadingSpinner';

const content = (
  <Descriptions size="small" column={2}>
    <Descriptions.Item label="创建人">张三</Descriptions.Item>
    <Descriptions.Item label="联系方式">
      <a>421421</a>
    </Descriptions.Item>
    <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
    <Descriptions.Item label="更新时间">2017-10-10</Descriptions.Item>
    <Descriptions.Item label="备注">
      中国浙江省杭州市西湖区古翠路
    </Descriptions.Item>
  </Descriptions>
);

export default function SiteLayout() {
  const { isAuthenticated, user } = useSelector(selectAuth);
  const { pathname } = useLocation();

  return (
    <ProLayout
      title="Coding Battles"
      {...proLayoutRoutes}
      location={{
        pathname: pathname,
      }}
      fixSiderbar
      fixedHeader
      menuDataRender={(menuData: MenuDataItem[]) => {
        if (user?.role !== Role.Admin) {
          menuData = menuData.filter(x => x.access !== Role.Admin);
        }

        return menuData;
      }}
      onMenuHeaderClick={e => console.log(e)}
      menuItemRender={(item: MenuDataItem, dom) => (
        <Link to={item.path!}>{dom}</Link>
      )}
      headerContentRender={() => <HeaderContent />}
      rightContentRender={() =>
        isAuthenticated ? <ProfileBadge /> : <AuthBadge />
      }
    >
      <Router />
    </ProLayout>
  );
}
