import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './config';
import { Result, ResultValue } from './types';
import {
  CreateGameRequest,
  GetGameListResultItem,
  GetGameResult,
  JoinGameRequest,
  LeaveGameRequest,
  RunTestRequest,
  RunTestResult,
  StartRoundRequest,
  SubmitResultRequest,
} from './types/games';

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/game/',
  }),
  tagTypes: ['Game'],
  endpoints: build => ({
    getAll: build.query<ResultValue<GetGameListResultItem[]>, void>({
      query: () => ({
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result && result.value
          ? [
              ...result?.value?.map(({ id }) => ({
                type: 'Game' as const,
                id,
              })),
              'Game',
            ]
          : ['Game'],
    }),

    getByUserId: build.query<ResultValue<GetGameListResultItem[]>, string>({
      query: userId => ({
        url: `gamesByUser/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result && result.value
          ? [
              ...result?.value?.map(({ id }) => ({
                type: 'Game' as const,
                id,
              })),
              'Game',
            ]
          : ['Game'],
    }),

    getById: build.query<ResultValue<GetGameResult>, string>({
      query: gameId => ({
        url: `${gameId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result && result.value ? [{ type: 'Game', id: arg }] : ['Game'],
    }),

    createGame: build.mutation<ResultValue<string>, CreateGameRequest>({
      query: request => ({
        url: `createGame/${request.userId}/${request.name}/${request.isPrivate}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: result?.value },
      ],
    }),

    joinGame: build.mutation<ResultValue<string>, JoinGameRequest>({
      query: request => ({
        url: `joinGame/${request.userId}/${request.code}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: result?.value },
      ],
    }),

    leaveGame: build.mutation<Result, LeaveGameRequest>({
      query: request => ({
        url: `leaveGame/${request.userId}/${request.gameId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: arg.gameId },
      ],
    }),

    startRound: build.mutation<ResultValue<number>, StartRoundRequest>({
      query: request => ({
        url: `startRound`,
        method: 'POST',
        data: request,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: arg.gameId },
      ],
    }),

    submitResult: build.mutation<Result, SubmitResultRequest>({
      query: request => ({
        url: `submitResult`,
        method: 'POST',
        data: request,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: arg.gameId },
      ],
    }),

    runTest: build.mutation<ResultValue<RunTestResult>, RunTestRequest>({
      query: request => ({
        url: 'runTest',
        method: 'POST',
        data: request,
      }),
    }),
  }),
});