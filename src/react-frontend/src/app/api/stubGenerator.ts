import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './settings';
import { ResultValue } from './types';
import { StubGeneratorModel, StubGeneratorResult } from './types/stubGenerator';

export const stubGeneratorApi = createApi({
  reducerPath: 'stubGeneratorApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/stubGenerator/',
  }),
  endpoints: build => ({
    generateStub: build.query<
      ResultValue<StubGeneratorResult>,
      StubGeneratorModel
    >({
      query: (request: StubGeneratorModel) => ({
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
