import { OrderStyle } from '.';

export type ChallengeTag = {
  id: string;
  name: string;
};

export enum SortBy {
  Name = 'Name',
  Difficulty = 'Difficulty',
};

export type ChallengeSearchRequest = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  orderStyle?: OrderStyle;
  text?: string;
  tagIds?: string[];
  minimumDifficulty?: number;
  maximumDifficulty?: number;
  includeNoDifficulty?: boolean;
};

export type ChallengeSearchResultItem = {
  id: string;
  createdByUserId: string;
  name: string;
  descriptionShort: string;
  difficulty: number;
  tagIds: string[];
};

export type TestCase = {
  input: string;
  expectedOutput: string;
};

export type TestPair = {
  title: string;
  case?: TestCase;
  validator?: TestCase;
};

export type Solution = {
  language: string;
  sourceCode?: string;
};

type ChallengeSaveModel = {
  name: string;
  descriptionShort: string;
  descriptionMarkdown: string;
  stubGeneratorInput: string;
  tests: TestPair[];
  solution: Solution;
  tagIds: string[];
};

export type ChallengeSaveModelWithId = {
  id?: string;
  model?: ChallengeSaveModel;
};

export enum ChallengeStatus {
  Draft = 1,
  Published = 2,
  Unpublished = 3,
}

export type Feedback = {
  id: string;
  userId: string;
  difficulty: number;
  fun: number;
  testCasesRelevancy: number;
  text: string;
  hasIssues: boolean;
};

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
  tagIds: string[];
  feedbacks: Feedback[];
  difficulty: number;
  createdByUserId: string;
  lastModifiedOn: Date;
};
