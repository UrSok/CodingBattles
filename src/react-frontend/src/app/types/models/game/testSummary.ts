import { TestSummaryStatus } from 'app/types/enums/testSummaryStatus';
import { TestPair } from '../challenge/testPair';

export type TestSummary = {
  status: TestSummaryStatus;
  reason: string;
  testPair: TestPair;
};
