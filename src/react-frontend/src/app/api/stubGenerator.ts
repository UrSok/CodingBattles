import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './config';
import { ResultValue } from './types';
import { StubGeneratorModel, StubGeneratorResult } from './types/stubGenerator';
import { skipToken } from '@reduxjs/toolkit/dist/query';

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
