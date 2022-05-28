import { TestCase } from './testCase';

export type TestPair = {
  title: string;
  case?: TestCase;
  validator?: TestCase;
};
