import { TestPair } from 'app/types/models/challenge/testPair';
import { Solution } from 'app/types/models/general/solution';

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

export type RunTestRequest = {
  id: string;
  solution: Solution;
  test: TestPair;
};

export type RunTestResult = {
  id: string;
  outputError: string;
  test: TestResult;
  validator: TestResult;
};
