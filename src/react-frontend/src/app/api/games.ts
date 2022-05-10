import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './config';
import { ResultValue } from './types';
import { RunTestRequest, RunTestResult } from './types/games';

export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/games/',
  }),
  endpoints: build => ({
    runTest: build.mutation<ResultValue<RunTestResult>, RunTestRequest>({
      query: request => ({
        url: 'runTest',
        method: 'POST',
        data: request,
      }),
    }),
  }),
});
