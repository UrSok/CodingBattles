import { createApi } from '@reduxjs/toolkit/query/react';
import { ResultWithValue } from 'app/utils/types/api';
import { useInjectReducer } from 'redux-injectors';
import { axiosBaseQuery } from '../customBaseQuery';
import { Paginated } from '../types';
import { ChallengeSearchRequest, ChallengeSearchResultItem } from './types';

export const challengeApi = createApi({
  reducerPath: 'challengeApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'v1/challenge/',
  }),
  endpoints: build => ({
    searchChallenges: build.mutation<
      ResultWithValue<Paginated<ChallengeSearchResultItem>>,
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

export const useChallengeApi = () => {
  useInjectReducer({
    key: challengeApi.reducerPath,
    reducer: challengeApi.reducer,
  });
  return challengeApi;
};
