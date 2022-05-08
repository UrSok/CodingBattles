import { createApi } from '@reduxjs/toolkit/query/react';

import { authActions } from 'app/slices/auth';
import { axiosBaseQuery } from './config';
import { ResultValue } from './types';
import { AuthUserWithToken, SignInModel, SignUpModel } from './types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/user/',
  }),
  endpoints: build => ({
    signUp: build.mutation<ResultValue<boolean>, SignUpModel>({
      query: signUpRequest => ({
        url: 'register',
        method: 'POST',
        data: signUpRequest,
      }),
    }),

    signIn: build.mutation<ResultValue<AuthUserWithToken>, SignInModel>({
      query: signInRequest => ({
        url: 'auth',
        method: 'POST',
        data: signInRequest,
      }),
      async onQueryStarted(email, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data.isSuccess && data.value) {
          dispatch(authActions.signIn(data.value));
        }
      },
    }),

    isUniqueEmail: build.query<ResultValue<boolean>, string>({
      query: email => ({
        url: `isUniqueEmail/${email}`,
        method: 'GET',
      }),
    }),
  }),
});
