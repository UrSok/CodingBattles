import { PayloadAction } from '@reduxjs/toolkit';
import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { signUpFormActions as actions } from '.';
import { Passwords } from './types';

function* checkPasswords(action: PayloadAction<Passwords>) {
  const { password, confirmPassword } = action.payload;
  if (password?.value !== confirmPassword?.value) {
    yield put(actions.setPasswordsDontMatch());
    return;
  }
  yield put(actions.setPasswordsMatch());
}

export function* signUpFormSaga() {
  yield takeLatest(actions.checkPasswordsMatch.type, checkPasswords);
}
