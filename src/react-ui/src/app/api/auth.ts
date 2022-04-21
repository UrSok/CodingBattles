import { createApi } from '@reduxjs/toolkit/query';
import { AuthUser } from 'app/slices/auth/types';
import { ResultWithValue } from 'app/utils/types/api';
import { axiosBaseQuery } from './customBaseQuery';

export const authApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: 'v1/user/',
  }),
  endpoints: build => ({
    getUserInfo: build.query<ResultWithValue<AuthUser>, string>({
      query: (arg: string) => ({ url: 'getAuth/jwt', method: 'GET' }),
    }),
  }),
});

//export const { use } = authApi;
