import { TestPair } from './challenge';

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
