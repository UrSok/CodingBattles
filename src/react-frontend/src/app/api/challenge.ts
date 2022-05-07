import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './settings';
import { Paginated, ResultValue } from './types';
import {
  Challenge,
  ChallengeSaveModelWithId,
  ChallengeSearchRequest,
  ChallengeSearchResultItem,
} from './types/challenge';

export const challengeApi = createApi({
  reducerPath: 'challengeApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/challenge/',
  }),
  tagTypes: ['Challenges'],
  endpoints: build => ({
    getChallenges: build.query<
      ResultValue<Paginated<ChallengeSearchResultItem>>,
      ChallengeSearchRequest
    >({
      query: (request: ChallengeSearchRequest) => ({
        method: 'POST',
        data: request,
      }),
      providesTags: ['Challenges'],
    }),

    getChallenge: build.query<ResultValue<Challenge>, string>({
      query: (id: string) => ({
        url: id,
        method: 'GET',
      }),
    }),

    saveChallenge: build.mutation<
      ResultValue<string>,
      ChallengeSaveModelWithId
    >({
      query: (request: ChallengeSaveModelWithId) => ({
        url: request.id ? `save/${request.id}` : 'save', //'save/' + request.id,// ? request.id : '',
        method: 'POST',
        data: request.model,
      }),
      invalidatesTags: ['Challenges'],
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
