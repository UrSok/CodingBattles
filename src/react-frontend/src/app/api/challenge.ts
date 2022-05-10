import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './config';
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
  tagTypes: ['Challenge'],
  endpoints: build => ({
    getChallenges: build.query<
      ResultValue<Paginated<ChallengeSearchResultItem>>,
      ChallengeSearchRequest
    >({
      query: (request: ChallengeSearchRequest) => ({
        method: 'POST',
        data: request,
      }),
      providesTags: (result, error, arg) =>
        result && result.value
          ? [
              ...result?.value?.items?.map(({ id }) => ({
                type: 'Challenge' as const,
                id,
              })),
              'Challenge',
            ]
          : ['Challenge'],
    }),

    getChallenge: build.query<ResultValue<Challenge>, string>({
      query: (id: string) => ({
        url: id,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result && result.value
          ? [{ type: 'Challenge', id: result.value.id }]
          : ['Challenge'],
    }),

    saveChallenge: build.mutation<
      ResultValue<string>,
      ChallengeSaveModelWithId
    >({
      query: (request: ChallengeSaveModelWithId) => ({
        url: request.id ? `save/${request.id}` : 'save',
        method: 'POST',
        data: request.model,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Challenge', id: arg.id },
      ],
    }),

    publishChallenge: build.mutation<ResultValue<string>, string>({
      query: (id: string) => ({
        url: `publish/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Challenge', id: arg }],
    }),
  }),
});
