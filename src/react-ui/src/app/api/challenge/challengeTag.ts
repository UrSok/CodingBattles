import { createApi } from '@reduxjs/toolkit/query/react';
import { ResultWithValue } from 'app/utils/types/api';
import { useInjectReducer } from 'redux-injectors';
import { axiosBaseQuery } from '../customBaseQuery';
import { ChallengeTag } from './types';

export const challengeTagApi = createApi({
  reducerPath: 'challengeTagApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'v1/tag/',
  }),
  endpoints: build => ({
    getTags: build.query<ResultWithValue<ChallengeTag[]>, void>({
      query: () => ({ url: '', method: 'GET' }),
    }),
  }),
});

export const useChallengeTagApi = () => {
  useInjectReducer({
    key: challengeTagApi.reducerPath,
    reducer: challengeTagApi.reducer,
  });
  return challengeTagApi;
};
