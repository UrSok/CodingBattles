/**
 * Create the store with dynamic reducers
 */

import { configureStore, StoreEnhancer } from '@reduxjs/toolkit';
import { authApi } from 'app/api/auth';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';

import { createReducer } from './reducers';

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  const apiMiddlewares = [authApi.middleware];
  // Create the store with saga middleware
  const middlewares = [sagaMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ] as StoreEnhancer[];

  const store = configureStore({
    reducer: createReducer(),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(middlewares).concat(apiMiddlewares),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers,
  });

  return store;
}
