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
import { useMonaco } from '@monaco-editor/react';
import { stubDefinitions, stubInputLangId } from '../config/monacoconfig';

const CenteredNoLayout = styled.div`
  height: 100vh;
  flex-direction: row-reverse;
  display: flex;
  justify-content: center;
  align-content: center;
`;

export function App() {
  const { i18n } = useTranslation();
  const monaco = useMonaco();
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();
  const { isInitialized } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(actions.initialize());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    monaco?.languages.register({ id: stubInputLangId });
    monaco?.languages.setMonarchTokensProvider(
      stubInputLangId,
      stubDefinitions(),
    );
  }, [monaco]);

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
