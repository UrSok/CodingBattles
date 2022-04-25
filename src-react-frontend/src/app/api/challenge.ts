import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './settings';
import { Paginated, ResultValue } from './types';
import {
  ChallengeSearchRequest,
  ChallengeSearchResultItem,
} from './types/challenge';

export const challengeApi = createApi({
  reducerPath: 'challengeApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'v1/challenge/',
  }),
  endpoints: build => ({
    getChallenges: build.mutation<
      ResultValue<Paginated<ChallengeSearchResultItem>>,
      ChallengeSearchRequest
    >({
      query: (request: ChallengeSearchRequest) => ({
        url: '',
        method: 'POST',
        data: request,
      }),
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
