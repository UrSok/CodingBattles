import { PayloadAction } from '@reduxjs/toolkit';
import { ApiException } from 'app/utils/types/api';
import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { actions } from '.';

function* handleException(action: PayloadAction<any>) {
  /*if (action.payload === ApiException.Status500) {

  }*/

  if (action.payload === ApiException.ServerUnreachable) {
    yield put(actions.setServerUnreachable());
  }
}

export function* Saga() {
  yield takeLatest(actions.handleException.type, handleException);
}
