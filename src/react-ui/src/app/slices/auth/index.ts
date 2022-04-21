import { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from 'app/api/auth';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { authSaga } from './saga';
import { AuthState, AuthUser, Role, SignInModel } from './types';

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
    tryAuthenticate(state, actions: PayloadAction<SignInModel>) {},
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
  }/*,
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.getUserInfo.matchFulfilled,
      (state, action) => {
        state.user = action.payload.value!;
        state.isInitialized = true;
        state.isAuthenticated = true;
      },
    );
  },*/
});

export const { actions } = slice;

export const useAuthSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: authSaga });
  return { actions: slice.actions };
};
