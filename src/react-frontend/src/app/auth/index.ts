import { PayloadAction } from '@reduxjs/toolkit';
import { AuthUser, AuthUserWithToken, Role } from 'app/api/types/auth';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { authSaga } from './saga';
import { AuthState } from './types';

export const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  isAdmin: false,
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initialize(state) {},
    signIn(state, action: PayloadAction<AuthUserWithToken>) {},
    signOut(state) {},

    setNotAuthenticated(state) {
      state.isAuthenticated = initialState.isAuthenticated;
      state.isAdmin = initialState.isAdmin;
      state.user = initialState.user;
      state.isInitialized = true;
    },
    setAuthenticated(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      if (action.payload.role === Role.Admin) {
        state.isAdmin = true;
      }

      state.isAuthenticated = true;
      state.isInitialized = true;
    },
  },
});

export const { actions: authActions } = slice;

export const useAuthSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: authSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useAuthSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */