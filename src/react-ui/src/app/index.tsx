/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthSlice } from './slices/auth';

import SiteLayout from './SiteLayout';

import './index.css';
import { selectAuth } from './slices/auth/selectors';
import LoadingSpinner from './components/LoadingSpinner';
import styled from 'styled-components';

import { ConfigProvider } from 'antd';

ConfigProvider.config({
  theme: {
    primaryColor: '#25b864',
  },
});

export function App() {
  const { i18n } = useTranslation();
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();
  //const v = useRoutes([

  //])

  React.useEffect(() => {
    dispatch(actions.initialize());
  }, [actions, dispatch]);

  const { isInitialized } = useSelector(selectAuth);

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
      <GlobalStyle />
      {isInitialized ? (
        <SiteLayout />
      ) : (
        <div>
          <CenteredNoPageDiv>
            {/*<img
              style={{ display: 'inline' }}
              src="https://i.pinimg.com/originals/b4/ab/07/b4ab07d201c63103c88bc20577c2cd0f.png"
              alt="logo"
              width="100px"
      />*/}
            <LoadingSpinner />
          </CenteredNoPageDiv>
        </div>
      )}
    </BrowserRouter>
  );
}

const CenteredNoPageDiv = styled.div`
  height: 100vh;
  flex-direction: row-reverse;
  display: flex;
  justify-content: center;
  align-content: center;
`;
