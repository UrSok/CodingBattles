import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import ProLayout, { PageContainer, SettingDrawer } from '@ant-design/pro-layout';
import { useTranslation } from 'react-i18next';
import './styles/index.less';
import { Button } from 'antd';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>
    <ProLayout
      title="Coding Battles"
      fixSiderbar
      fixedHeader

      onMenuHeaderClick={e => console.log(e)}

    >
      <Button  type="primary">test</Button>
    </ProLayout>
    </BrowserRouter>
  );
}
