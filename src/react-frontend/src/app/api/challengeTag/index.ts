import { createApi } from '@reduxjs/toolkit/query/react';
import { ChallengeTag } from 'app/types/models/challenge/challengeTag';
import { axiosBaseQuery } from '../../config';
import { ResultValue } from '../types';

export const challengeTagApi = createApi({
  reducerPath: 'challengeTagApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/tag/',
  }),
  endpoints: build => ({
    getTags: build.query<ResultValue<ChallengeTag[]>, void>({
      query: () => ({ method: 'GET' }),
    }),
  }),
});
