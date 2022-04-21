import { PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';
import { Actions as actions } from '.';
import { Passwords, SignUpModel } from './types';
import { FieldData } from 'rc-field-form/lib/interface';
import { AuthService } from 'app/api/authService';

function* checkEmail(action: PayloadAction<FieldData>) {
  const emailField = action.payload!;

  if (
    !emailField ||
    !emailField?.touched ||
    emailField?.value?.length < 5 ||
    (emailField.errors && emailField.errors.length > 0)
  ) {
    yield put(actions.setUniqueEmailNone());
    return;
  }

  yield put(actions.setUniqueEmailIsValidating());
  try {
    const result = yield AuthService.isUniqueEmail(emailField.value);
    if (!result) {
      yield put(actions.setNotUniqueEmail());
      return;
    }
    yield put(actions.setUniqueEmail());
  } catch (ex: any) {
    console.log(ex);
    yield put(actions.setUniqueEmailNone());
  }
}

function* checkPasswords(action: PayloadAction<Passwords>) {
  const { password, confirmPassword } = action.payload;
  if (password?.value !== confirmPassword?.value) {
    yield put(actions.setPasswordsDontMatch());
    return;
  }
  yield put(actions.setPasswordsMatch());
}

function* trySignUp(action: PayloadAction<SignUpModel>) {
  const { email, username, password } = action.payload;
  const result = yield AuthService.register(email, username, password);
  yield put(actions.setSignUpResult());
}

export function* signUpSaga() {
  yield takeLatest(actions.checkUniquieEmail.type, checkEmail);
  yield takeLatest(actions.checkPasswordsMatch.type, checkPasswords);
  yield takeLatest(actions.trySignUp.type, trySignUp);
}
