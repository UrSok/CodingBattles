import { TestPair } from 'app/types/models/challenge/testPair';
import { Solution } from 'app/types/models/general/solution';

type ChallengeSaveRequest = {
  name: string;
  descriptionShort: string;
  descriptionMarkdown: string;
  stubGeneratorInput: string;
  tests: TestPair[];
  solution: Solution;
  tagIds: string[];
};

export type ChallengeSaveRequestWithParameters = {
  id?: string;
  model?: ChallengeSaveRequest;
};
