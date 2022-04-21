import { PayloadAction } from '@reduxjs/toolkit';
import { FieldData } from 'rc-field-form/lib/interface';
import { Result } from 'app/utils/types/api';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { signUpSaga } from './saga';
import { Passwords, SignUpModel, SignUpState } from './types';

export const initialState: SignUpState = {
  passwordMatch: 'none',
  isUniqueEmailValidating: false,
  isUniqueEmail: 'none',
  signUpResult: undefined,
};

const slice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    reset(state) {
      state.passwordMatch = initialState.isUniqueEmail;
      state.isUniqueEmailValidating = initialState.isUniqueEmailValidating;
      state.isUniqueEmail = initialState.isUniqueEmail;
      state.signUpResult = undefined;
    },

    checkUniquieEmail(state, action: PayloadAction<FieldData>) {},
    setUniqueEmailIsValidating(state) {
      state.isUniqueEmailValidating = true;
    },
    setUniqueEmailNone(state) {
      state.isUniqueEmail = 'none';
      state.isUniqueEmailValidating = false;
    },
    setNotUniqueEmail(state) {
      state.isUniqueEmail = 'no';
      state.isUniqueEmailValidating = false;
    },
    setUniqueEmail(state) {
      state.isUniqueEmail = 'yes';
      state.isUniqueEmailValidating = false;
    },

    checkPasswordsMatch(state, action: PayloadAction<Passwords>) {},
    setPasswordMatchNone(state) {
      state.passwordMatch = 'no';
    },
    setPasswordsDontMatch(state) {
      state.passwordMatch = 'no';
    },
    setPasswordsMatch(state) {
      state.passwordMatch = 'yes';
    },

    trySignUp(state, action: PayloadAction<SignUpModel>) {},
    setSignUpResult(state) {
      state.signUpResult = 'nice';
    },
  },
});

export const { actions: Actions } = slice;

export const useSignUpSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: signUpSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
