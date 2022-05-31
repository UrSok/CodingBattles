import { RoundSummaryStatus } from 'app/types/enums/roundSummaryStatus';
import { Solution } from '../general/solution';
import { UserDto } from '../user/userDto';
import { TestSummary } from './testSummary';

export type RoundSummary = {
  status: RoundSummaryStatus;
  user: UserDto;
  score: number;
  timePassed: number;
  solutionShared: boolean;
  solution?: Solution;
  testSummaries: TestSummary[];
};
