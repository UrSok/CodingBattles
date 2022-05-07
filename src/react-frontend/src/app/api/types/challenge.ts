import { OrderStyle } from '.';

export type ChallengeTag = {
  id: string;
  name: string;
};

export type ChallengeSearchResultItem = {
  id: string;
  name: string;
  descriptionShort: string;
  difficulty: number;
  tags: ChallengeTag[];
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
  sourceCoude?: string;
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
