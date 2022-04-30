import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { layoutActions } from 'app/layout/slice';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { Result, ResultValue } from '../types';
import axiosInstance from './axios';

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = {
      baseUrl: '/api/',
    },
  ): BaseQueryFn<
    {
      url?: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }, api) => {
    try {
      const result = await axiosInstance({
        url: url ? baseUrl + url : baseUrl,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      //TODO: Handle 401 some day.
      api.dispatch(layoutActions.showUnkownException());
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
