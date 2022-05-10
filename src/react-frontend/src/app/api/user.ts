import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './config';

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'url',
  }),
  endpoints: build => ({}),
});
