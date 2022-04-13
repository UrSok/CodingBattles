/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter, Router } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useAuthSlice } from './slices/auth';

export function App() {
  const { i18n } = useTranslation();
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(actions.initialize());
  }, [actions, dispatch]);

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - CodingBattle"
        defaultTitle="CodingBattle"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta
          name="description"
          content="A platform for challenging others in a coding battle."
        />
      </Helmet>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
