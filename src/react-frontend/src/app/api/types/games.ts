import { Challenge, Solution, TestPair } from './challenge';
import { UserModel } from './user';

export enum GameStatus {
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
export type GameSearchItem = {
  id: string;
  code: string;
  name: string;
  status: GameStatus;
  users: UserModel[];
};

//===========================
export type RoundSummaryDetails = {
  user: UserModel;
  solution: Solution;
  testSummaries: TestSummary[];
};

export type RoundDetails = {
  number: number;
  startTime?: Date;
  durationMinutes: number;
  challenge: Challenge;
  roundSummaries: RoundSummaryDetails[];
};

export type GameDetails = {
  code: string;
  name: string;
  status: GameStatus;
  isPrivate: boolean;
  gameMasterUser: UserModel;
  users: UserModel[];
  currentRound?: RoundDetails;
  previousRounds: RoundDetails[];
};
//===========================
export type StartRoundRequest = {
  gameId: string;
}

//===========================
export type SubmitResultRequest = {
  gameId: string;
  roundNumber: number;
  roundSummary: RoundSummary;
};

//===========================
export type SelectChallengeRequest = {
  gameId: string;
  challengeId: string;
};
