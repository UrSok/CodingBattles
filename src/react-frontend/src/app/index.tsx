import * as React from 'react';
import { useMonaco } from '@monaco-editor/react';
import { notification } from 'antd';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import { stubInputLanguage, stubLangDefinitions } from '../config/monaco';
import { selectAuth } from './slices/auth/selectors';
import { selectLayout } from './slices/layout/selectors';
import { useAuthSlice } from './slices/auth';
import { useLayoutSlice } from './slices/layout';
import { translations } from 'locales/translations';

import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';

import { useEffectOnce } from 'usehooks-ts';

import './styles/index.less';

export default function App() {
  const { i18n, t } = useTranslation();
  const monaco = useMonaco();
  const dispatch = useDispatch();

  const { actions: authActions } = useAuthSlice();
  const { actions: layoutActions } = useLayoutSlice();
  const { isInitialized } = useSelector(selectAuth);
  const { showUnkownError } = useSelector(selectLayout);

  useEffectOnce(() => {
    dispatch(authActions.initialize());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: stubInputLanguage });
      monaco.languages.setMonarchTokensProvider(
        stubInputLanguage,
        stubLangDefinitions,
      );
    }
    // TODO: ADD LANGUAGE PROVIDER SOMEDAY
    /*monaco.languages.registerCompletionItemProvider(
        stubInputLang,
        stubLangCompletion,
      );*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco]);

  useEffect(() => {
    if (showUnkownError) {
      notification['error']({
        message: t(translations.UnkownErrorNotification.message),
        description: (
          <p>{t(translations.UnkownErrorNotification.description)}</p>
        ),
        duration: 10,
      });
      dispatch(layoutActions.resetUnkownException());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUnkownError]);

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
      {isInitialized ? <Layout /> : <LoadingSpinner centered />}
    </BrowserRouter>
  );
}
