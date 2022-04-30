import { createApi } from '@reduxjs/toolkit/query/react';
import { useInjectReducer } from 'redux-injectors';
import { axiosBaseQuery } from './settings';

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'url',
  }),
  endpoints: build => ({}),
});

export const useUserApi = () => {
  useInjectReducer({
    key: userApi.reducerPath,
    reducer: userApi.reducer,
  });
  return userApi;
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
