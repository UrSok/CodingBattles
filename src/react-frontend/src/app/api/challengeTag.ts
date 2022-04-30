import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './settings';
import { ResultValue } from './types';
import { ChallengeTag } from './types/challenge';

export const challengeTagApi = createApi({
  reducerPath: 'challengeTagApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/tag/',
  }),
  endpoints: build => ({
    getTags: build.query<ResultValue<ChallengeTag[]>, void>({
      query: () => ({ url: '', method: 'GET' }),
    }),
  }),
});

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
