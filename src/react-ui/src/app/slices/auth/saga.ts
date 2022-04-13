import axios from 'app/utils/axios';
import {
  getTokenForHeader,
  getTokenFromLocalStorageIfValid,
  getTokenPayload,
} from 'app/utils/jwt';
import { takeLatest, put } from 'redux-saga/effects';
import { ResultWithValue } from 'types/api-results/Result';
import { authActions as actions } from '.';
import { AuthUser } from './types';

function* initializeAuth() {
  const accessToken = getTokenFromLocalStorageIfValid();

  if (accessToken == null) {
    yield put(actions.setNotAuthenticated());
  } else {
    try {
      const { data } = yield axios.get(`v1/user/getAuth/jwt`, {
        headers: {
          Authorization: getTokenForHeader(accessToken),
        },
      });
      const result: ResultWithValue<AuthUser> = data;
      yield put(actions.setAuthenticated(result.value));
    } catch (exception: any) {
      yield put(actions.setNotAuthenticated());
    }
  }
}

export function* authSaga() {
  yield takeLatest(actions.initialize.type, initializeAuth);
}
