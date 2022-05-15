import { Challenge, Solution, TestPair } from './challenge';
import { UserModel } from './user';

export enum RoundStatus {
  NotStarted = 0,
  InProgress = 1,
  Finished = 2,
}

export enum TestSummaryStatus {
  Valid = 0,
  TestFailed = 1,
  ValidatorFailed = 2,
}

export type TestSummary = {
  status: TestSummaryStatus;
  reason: string;
  testPair: TestPair;
};

export type RoundSummary = {
  userId: string;
  solution: Solution;
  testSummaries: TestSummary[];
};

//===========================
export type RunTestRequest = {
  id: string;
  language: string;
  sourceCode: string;
  test: TestPair;
};

export type TestResult = {
  note: string;
  status: string;
  buldStdout: string;
  buildStderr: string;
  buildExitCode?: number;
  buildTime: string;
  buildMemory?: number;
  buildResult: string;
  stdout: string;
  stderr: string;
  exitCode?: number;
  time: string;
  memory: string;
  connections: string;
  result: string;
};

export type RunTestResult = {
  id: string;
  outputError: string;
  test: TestResult;
  validator: TestResult;
};

//===========================
export type CreateGameRequest = {
  userId: string;
  name: string;
  isPrivate: boolean;
};

//===========================
export type JoinGameRequest = {
  userId: string;
  code: string;
};

//===========================
export type LeaveGameRequest = {
  userId: string;
  gameId: string;
};

//===========================
export type GetGameListResultItem = {
  id: string;
  code: string;
  name: string;
  roundStatus: RoundStatus;
  users: UserModel[];
};

//===========================
export type GetGameRoundSummaryResult = {
  user: UserModel;
  solution: Solution;
  testSummaries: TestSummary[];
};

export type GetGameRoundResult = {
  number: number;
  startTime: Date;
  durationMinutes: number;
  challenge: Challenge;
  roundSummaries: GetGameRoundSummaryResult[];
};

export type GetGameResult = {
  code: string;
  name: string;
  isPrivate: boolean;
  createdByUser: UserModel;
  users: UserModel[];
  status: RoundStatus;
  rounds: GetGameRoundResult[];
};
//===========================
export type StartRoundRequest = {
  gameId: string;
  challengeId: string;
}

//===========================
export type SubmitResultRequest = {
  gameId: string;
  roundNumber: number;
  roundSummary: RoundSummary;
};
