import { ChallengeStatus } from 'app/types/enums/challengeStatus';
import { Solution } from '../general/solution';
import { UserDto } from '../user/userDto';
import { ChallengeTag } from './challengeTag';
import { Feedback } from './feedback';
import { TestPair } from './testPair';

export type Challenge = {
  id: string;
  name: string;
  descriptionShort: string;
  descriptionMarkdown: string;
  stubGeneratorInput: string;
  status: ChallengeStatus;
  statusReason: string;
  tests: TestPair[];
  solution: Solution;
  tags: ChallengeTag[];
  feedbacks: Feedback[];
  difficulty: number;
  fun: number;
  testCasesRelevancy: number;
  user: UserDto;
  lastModifiedOn: Date;
};
