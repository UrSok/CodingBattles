import { createApi } from '@reduxjs/toolkit/query/react';
import { Game } from 'app/types/models/game/game';
import { GameSearchItem } from 'app/types/models/game/gameSearchItem';
import { axiosBaseQuery } from '../../config';
import { Result, ResultValue } from '../types';
import { CreateGameParameters } from './types/createGame';
import { JoinGameParameters } from './types/joinGame';
import { LeaveGameParameters } from './types/leaveGame';
import { RunTestRequest, RunTestResult } from './types/runTest';
import { SaveSolutionWithParameters } from './types/saveSolution';
import { SelectChallengeParameters } from './types/selectChallenge';
import { ShareSolutionParameters } from './types/shareSolution';
import { SubmitResultRequest } from './types/submitResult';
import { UpdateCurrentRoundSettingsWithParameters } from './types/updateCurrentRoundSettings';

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
      providesTags: (result, error, request) =>
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

    getGamesByUserId: build.query<ResultValue<GameSearchItem[]>, string>({
      query: userId => ({
        url: `getGamesByUser/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, request) =>
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
      providesTags: (result, error, request) =>
        result && result.value ? [{ type: 'Game', id: request }] : ['Game'],
    }),

    createGame: build.mutation<ResultValue<string>, CreateGameParameters>({
      query: request => ({
        url: `createGame/${request.userId}/${request.name}/${request.isPrivate}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: result?.value },
      ],
    }),

    joinGame: build.mutation<ResultValue<string>, JoinGameParameters>({
      query: request => ({
        url: `joinGame/${request.userId}/${request.code}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: result?.value },
      ],
    }),

    leaveGame: build.mutation<Result, LeaveGameParameters>({
      query: request => ({
        url: `leaveGame/${request.userId}/${request.gameId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request.gameId },
      ],
    }),

    createRound: build.mutation<Result, string>({
      query: gameId => ({
        url: `${gameId}/currentRound/create`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request },
      ],
    }),

    updateCurrentRoundSettings: build.mutation<Result, UpdateCurrentRoundSettingsWithParameters>({
      query: parameters => ({
        url: `${parameters.gameId}/currentRound/update/settings`,
        method: 'POST',
        data: parameters.request,
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request.gameId },
      ],
    }),

    selectChallenge: build.mutation<Result, SelectChallengeParameters>({
      query: request => ({
        url: `${request.gameId}/selectChallenge/${request.challengeId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request.gameId },
      ],
    }),

    startRound: build.mutation<Result, string>({
      query: gameId => ({
        url: `${gameId}/currentRound/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request },
      ],
    }),

    endRound: build.mutation<Result, string>({
      query: gameId => ({
        url: `${gameId}/currentRound/end`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request },
      ],
    }),

    submitResult: build.mutation<Result, SubmitResultRequest>({
      query: request => ({
        url: `submitResult`,
        method: 'POST',
        data: request,
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request.gameId },
      ],
    }),

    shareSolution: build.mutation<Result, ShareSolutionParameters>({
      query: parameters => ({
        url: `${parameters.gameId}/${parameters.roundNumber}/${parameters.userId}/shareSolution`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request.gameId },
      ],
    }),

    saveSolution: build.mutation<Result, SaveSolutionWithParameters>({
      query: parameters => ({
        url: `${parameters.gameId}/${parameters.userId}/saveSolution`,
        method: 'POST',
        data: parameters.solution,
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Game', id: request.gameId },
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
