import React from 'react';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Router from 'app/routes/Router';
import { menuRoutes } from 'app/routes/menuRoutes';

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
      //headerRender={false}
      onMenuHeaderClick={() => navigate('/')}
      menuDataRender={(menuData: MenuDataItem[]): MenuDataItem[] => {
        return menuData;
      }}
      menuItemRender={(item: MenuDataItem, dom) => (
        <Link to={item.path!}>{dom}</Link>
      )}
      headerContentRender={() => <p>bla bla</p>}
      rightContentRender={() => <p>bla bla</p>}
    >
      <Router />
    </ProLayout>
  );
}
