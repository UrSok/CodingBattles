import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from './components/LoadingSpinner';
import styled from 'styled-components';

import './styles/index.less';
import AppLayout from './layout';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from './auth/selectors';
import { useAuthSlice } from './auth';
import { useEffect } from 'react';

const CenteredNoLayout = styled.div`
  height: 100vh;
  flex-direction: row-reverse;
  display: flex;
  justify-content: center;
  align-content: center;
`;

export function App() {
  const { i18n } = useTranslation();

  const { actions } = useAuthSlice();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.initialize());
  }, []);

  const { isInitialized } = useSelector(selectAuth);

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
      {isInitialized ? (
        <AppLayout />
      ) : (
        <CenteredNoLayout>
          <LoadingSpinner />
        </CenteredNoLayout>
      )}
    </BrowserRouter>
  );
}
