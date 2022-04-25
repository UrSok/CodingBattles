import { createApi } from '@reduxjs/toolkit/query/react';
import { useInjectReducer } from 'redux-injectors';
import { axiosBaseQuery } from './settings';
import { AuthUserWithToken, SignInModel, SignUpModel } from './types/auth';
import { ResultValue } from './types';
import { signUpFormActions } from 'app/layout/components/auth/Forms/SignUpForm/slice';
import { authActions } from 'app/auth';

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
      async onQueryStarted(email, { dispatch, queryFulfilled }) {
        dispatch(signUpFormActions.setNullUniqueEmail());
        const { data } = await queryFulfilled;
        if (data.value === true) {
          dispatch(signUpFormActions.setUniqueEmail());
        } else if (data.value === false) {
          dispatch(signUpFormActions.setNotUniqueEmail());
        }
      },
    }),
  }),
});

export const useAuthApi = () => {
  useInjectReducer({
    key: authApi.reducerPath,
    reducer: authApi.reducer,
  });
  return authApi;
};

/**
 * Example Mutation Usage:
 *
 * searchChallenges: build.mutation<
 *     ResultWithValue<Paginated<ChallengeSearchResultItem>>,
 *     ChallengeSearchRequest
 *   >({
 *     query: (request: ChallengeSearchRequest) => ({
 *       url: '',
 *       method: 'POST',
 *       data: request,
 *     }),
 *   }),
 */

/**
 * Example Query Usage:
 *
 * getTags: build.query<ResultWithValue<ChallengeTag[]>, void>({
 *     query: () => ({ url: '', method: 'GET' }),
 *   }),
 */
