import { PayloadAction } from '@reduxjs/toolkit';
import { AuthUserResult } from 'app/api/auth/types/authUser';
import { Role } from 'app/types/enums/role';
import { UserDto } from 'app/types/models/user/userDto';
import {
  getTokenFromLocalStorage,
  getTokenPayload,
  isTokenValid,
  setSession,
} from 'app/utils/jwt';
import { put, takeLatest } from 'redux-saga/effects';
import { authActions } from '.';


function* initialize() {
  const accessToken = getTokenFromLocalStorage();
  if (accessToken == null || !isTokenValid(accessToken)) {
    yield put(authActions.setNotAuthenticated());
    setSession(null);
    return;
  }

  setSession(accessToken);
  yield put(authActions.setAuthenticated(getUserFromToken(accessToken)));
}

function* singIn(action: PayloadAction<AuthUserResult>) {
  const { accessToken } = action.payload;
  setSession(accessToken);
  yield put(authActions.setAuthenticated(getUserFromToken(accessToken)));
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

function getUserFromToken(accessToken: string): UserDto {
  const decodedToken = getTokenPayload(accessToken);
  return {
    id: decodedToken.nameid,
    username: decodedToken.unique_name,
    email: decodedToken.email,
    role: decodedToken.role as Role,
  };
}
