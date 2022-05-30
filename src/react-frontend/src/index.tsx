import * as React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
//import reportWebVitals from 'reportWebVitals';

import { configureAppStore } from 'store/configureStore';
import App from 'app';

// Initialize languages
import './locales/i18n';
import { BrowserRouter } from 'react-router-dom';

const store = configureAppStore();
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </HelmetProvider>
  </Provider>,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
