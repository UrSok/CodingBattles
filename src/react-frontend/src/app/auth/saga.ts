import { PayloadAction } from '@reduxjs/toolkit';
import { AuthUserWithToken, Role } from 'app/api/types/auth';
import {
  getTokenFromLocalStorage,
  getTokenPayload,
  initSession,
  isTokenValid,
  setSession,
} from 'app/utils/jwt';
import { put, takeLatest } from 'redux-saga/effects';
import { authActions as actions, authActions } from '.';

function* initialize() {
  const accessToken = getTokenFromLocalStorage();
  if (accessToken == null || !isTokenValid(accessToken)) {
    yield put(authActions.setNotAuthenticated());
    initSession(null);
    return;
  }

  initSession(accessToken);
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
  yield takeLatest(actions.initialize.type, initialize);
  yield takeLatest(actions.signIn.type, singIn);
  yield takeLatest(actions.signOut.type, singOut);
}
