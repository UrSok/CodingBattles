import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { authSaga } from './saga';
import { AuthState, AuthUser, Role } from './types';

export const initialState: AuthState = {
  isAuthenticated: false,
  isAdmin: false,
  isInitialized: false,
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initialize(state) {},
    setNotAuthenticated(state) {
      state.isInitialized = true;
    },
    setAuthenticated(state, actions: PayloadAction<AuthUser>) {
      state.user = actions.payload;

      if (actions.payload.role === Role.Admin) {
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
