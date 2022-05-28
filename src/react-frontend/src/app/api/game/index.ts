import { createApi } from '@reduxjs/toolkit/query/react';
import { Game } from 'app/types/models/game/game';
import { GameSearchItem } from 'app/types/models/game/gameSearchItem';
import { axiosBaseQuery } from '../../config';
import { Result, ResultValue } from '../types';
import { CreateGameParameters } from './types/createGame';
import { JoinGameParameters } from './types/joinGame';
import { LeaveGameParameters } from './types/leaveGame';
import { RunTestRequest, RunTestResult } from './types/runTest';
import { SelectChallengeParameters } from './types/selectChallenge';
import { SubmitResultRequest } from './types/submitResult';

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/game/',
  }),
  tagTypes: ['Game'],
  endpoints: build => ({
    getAll: build.query<ResultValue<GameSearchItem[]>, void>({
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

    getByUserId: build.query<ResultValue<GameSearchItem[]>, string>({
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

    getById: build.query<ResultValue<Game>, string>({
      query: gameId => ({
        url: `${gameId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result && result.value ? [{ type: 'Game', id: arg }] : ['Game'],
    }),

    createGame: build.mutation<ResultValue<string>, CreateGameParameters>({
      query: request => ({
        url: `createGame/${request.userId}/${request.name}/${request.isPrivate}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: result?.value },
      ],
    }),

    joinGame: build.mutation<ResultValue<string>, JoinGameParameters>({
      query: request => ({
        url: `joinGame/${request.userId}/${request.code}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: result?.value },
      ],
    }),

    leaveGame: build.mutation<Result, LeaveGameParameters>({
      query: request => ({
        url: `leaveGame/${request.userId}/${request.gameId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: arg.gameId },
      ],
    }),

    selectChallenge: build.mutation<Result, SelectChallengeParameters>({
      query: request => ({
        url: `${request.gameId}/selectChallenge/${request.challengeId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Game', id: arg.gameId },
      ],
    }),

    startRound: build.mutation<ResultValue<number>, string>({
      query: gameId => ({
        url: `${gameId}/startRound`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Game', id: arg }],
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
