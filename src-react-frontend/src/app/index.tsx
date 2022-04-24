import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from './components/LoadingSpinner';
import styled from 'styled-components';

import './styles/index.less';
import AppLayout from './pages/AppLayout';

const CenteredNoLayout = styled.div`
  height: 100vh;
  flex-direction: row-reverse;
  display: flex;
  justify-content: center;
  align-content: center;
`;

export function App() {
  const { i18n } = useTranslation();
  const isAuthInitialized: boolean = true;

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Coding Battles"
        defaultTitle="Coding Battles"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta
          name="description"
          content="A platform for challenging others in a coding battle."
        />
      </Helmet>
      {isAuthInitialized ? (
        <AppLayout />
      ) : (
        <CenteredNoLayout>
          <LoadingSpinner />
        </CenteredNoLayout>
      )}
    </BrowserRouter>
  );
}
