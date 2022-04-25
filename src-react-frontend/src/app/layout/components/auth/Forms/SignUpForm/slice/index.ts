import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { signUpFormSaga } from './saga';
import { Passwords, SignUpFormState } from './types';

export const initialState: SignUpFormState = {
  passwordMatch: null,
  isUniqueEmail: null,
};

const slice = createSlice({
  name: 'signUpForm',
  initialState,
  reducers: {
    reset(state) {
      state.passwordMatch = initialState.passwordMatch;
      state.isUniqueEmail = initialState.isUniqueEmail;
    },

    setNullUniqueEmail(state) {
      state.isUniqueEmail = null;
    },
    setNotUniqueEmail(state) {
      state.isUniqueEmail = false;
    },
    setUniqueEmail(state) {
      state.isUniqueEmail = true;
    },

    checkPasswordsMatch(state, action: PayloadAction<Passwords>) {},
    setPasswordsDontMatch(state) {
      state.passwordMatch = false;
    },
    setPasswordsMatch(state) {
      state.passwordMatch = true;
    },
  },
});

export const { actions: signUpFormActions } = slice;

export const useSignUpFormSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: signUpFormSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useSignUpFormSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
