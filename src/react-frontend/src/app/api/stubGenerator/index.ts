import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config';
import { ResultValue } from '../types';
import { GenerateStubRequest, GenerateStubResult } from './types/generateStub';

export const stubGeneratorApi = createApi({
  reducerPath: 'stubGeneratorApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/stubGenerator/',
  }),
  endpoints: build => ({
    generateStub: build.query<
      ResultValue<GenerateStubResult>,
      GenerateStubRequest
    >({
      query: (request: GenerateStubRequest) => ({
        method: 'POST',
        data: request,
      }),
    }),
  }),
});
