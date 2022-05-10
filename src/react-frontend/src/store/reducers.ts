import { combineReducers } from '@reduxjs/toolkit';
import {
  authApi,
  challengeApi,
  challengeTagApi,
  gamesApi,
  stubGeneratorApi,
} from 'app/api';

import { InjectedReducersType } from 'utils/types/injector-typings';

export function createReducer(injectedReducers: InjectedReducersType = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  if (Object.keys(injectedReducers).length === 0) {
    return state => state;
  } else {
    return combineReducers({
      [authApi.reducerPath]: authApi.reducer,
      [challengeApi.reducerPath]: challengeApi.reducer,
      [challengeTagApi.reducerPath]: challengeTagApi.reducer,
      [gamesApi.reducerPath]: gamesApi.reducer,
      [stubGeneratorApi.reducerPath]: stubGeneratorApi.reducer,
      ...injectedReducers,
    });
  }
}
