import { AuthService } from 'app/api/authService';
import { takeLatest, put } from 'redux-saga/effects';
import { ResultWithValue } from 'app/utils/types/api';
import { actions as authActions } from '.';
import { actions as exceptionActions } from '../exception';
import { AuthUser, AuthUserWithToken } from './types';

function* initializeAuth() {
  try {
    const result: ResultWithValue<AuthUser> = yield AuthService.initAuth();
    if (!result.isSuccess) {
      yield put(authActions.setNotAuthenticated());
      return;
    }
    yield put(authActions.setAuthenticated(result.value!));
  } catch (ex: any) {
    yield put(exceptionActions.handleException(ex));
  }
}

function* tryAuthenticate(action) {
  const result: ResultWithValue<AuthUserWithToken> =
    yield AuthService.authenticate(
      action.payload.email,
      action.payload.password,
    );

  if (!result.isSuccess) {
    yield put(authActions.setNotAuthenticated());
    return;
  }
  yield put(authActions.setAuthenticated(result.value!.user));
}

export function* authSaga() {
  yield takeLatest(authActions.initialize.type, initializeAuth);
  yield takeLatest(authActions.tryAuthenticate.type, tryAuthenticate);
}
