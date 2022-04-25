/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from 'app/api/auth';
import { challengeApi } from 'app/api/challenge';
import { challengeTagApi } from 'app/api/challengeTag';

import { InjectedReducersType } from 'utils/types/injector-typings';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  if (Object.keys(injectedReducers).length === 0) {
    return state => state;
  } else {
    return combineReducers({
      [authApi.reducerPath]: authApi.reducer,
      [challengeTagApi.reducerPath]: challengeTagApi.reducer,
      [challengeApi.reducerPath]: challengeApi.reducer,
      ...injectedReducers,
    });
  }
}
