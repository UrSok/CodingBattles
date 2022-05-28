import { createApi } from '@reduxjs/toolkit/query/react';
import { authActions } from 'app/slices/auth';
import { axiosBaseQuery } from '../../config';
import { Result, ResultValue } from '../types';
import { AuthUserRequest, AuthUserResult } from './types/authUser';
import { RegisterUserRequest } from './types/registerUser';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/user/',
  }),
  endpoints: build => ({
    signUp: build.mutation<Result, RegisterUserRequest>({
      query: signUpRequest => ({
        url: 'register',
        method: 'POST',
        data: signUpRequest,
      }),
    }),

    signIn: build.mutation<ResultValue<AuthUserResult>, AuthUserRequest>({
      query: signInRequest => ({
        url: 'auth',
        method: 'POST',
        data: signInRequest,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data.isSuccess && data.value) {
          dispatch(authActions.signIn(data.value));
        }
      },
    }),

    isUniqueEmail: build.query<Result, string>({
      query: email => ({
        url: `isUniqueEmail/${email}`,
        method: 'GET',
      }),
    }),
  }),
});
