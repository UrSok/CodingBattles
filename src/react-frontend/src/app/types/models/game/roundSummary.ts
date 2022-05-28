import { Solution } from '../general/solution';
import { UserDto } from '../user/userDto';
import { TestSummary } from './testSummary';

export type RoundSummary = {
  user: UserDto;
  solution: Solution;
  testSummaries: TestSummary[];
};
