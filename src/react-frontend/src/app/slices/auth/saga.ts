import { PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';

import { AuthUserWithToken, Role } from 'app/api/types/auth';
import {
  getTokenFromLocalStorage,
  getTokenPayload,
  isTokenValid,
  setSession,
} from 'app/utils/jwt';
import { authActions } from '.';

function* initialize() {
  const accessToken = getTokenFromLocalStorage();
  if (accessToken == null || !isTokenValid(accessToken)) {
    yield put(authActions.setNotAuthenticated());
    setSession(null);
    return;
  }

  setSession(accessToken);
  const userData = getTokenPayload(accessToken);
  yield put(
    authActions.setAuthenticated({
      id: userData.nameid,
      username: userData.unique_name,
      email: userData.email,
      role: userData.role as Role,
    }),
  );
}

function* singIn(action: PayloadAction<AuthUserWithToken>) {
  const { accessToken, user } = action.payload;
  setSession(accessToken);
  yield put(authActions.setAuthenticated(user));
}

function* singOut() {
  setSession(null);
  yield put(authActions.setNotAuthenticated());
}

export function* authSaga() {
  yield takeLatest(authActions.initialize.type, initialize);
  yield takeLatest(authActions.signIn.type, singIn);
  yield takeLatest(authActions.signOut.type, singOut);
}
