import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '../../config';
import { Result, ResultValue } from '../types';
import { ChallengeSearchRequest } from './types/challengeSearch';
import { ChallengeSearchItem } from '../../types/models/challenge/challengeSearchItem';
import { Challenge } from 'app/types/models/challenge/challenge';
import { ChallengeSaveRequestWithParameters } from './types/challengeSave';
import { UpublishChallengeParameters } from './types/unpublishChallenge';
import { Paginated } from 'app/types/models/general/paginated';

export const challengeApi = createApi({
  reducerPath: 'challengeApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/challenge/',
  }),
  tagTypes: ['Challenge'],
  endpoints: build => ({
    getChallenges: build.query<
      ResultValue<Paginated<ChallengeSearchItem>>,
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
      ChallengeSaveRequestWithParameters
    >({
      query: (request: ChallengeSaveRequestWithParameters) => ({
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

    unpublishChallenge: build.mutation<Result, UpublishChallengeParameters>({
      query: request => ({
        url: `unpublish/${request.challengeId}/${request.statusReason}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Challenge', id: arg.challengeId },
      ],
    }),
  }),
});
