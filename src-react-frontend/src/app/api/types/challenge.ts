import { OrderStyle } from '.';

export type ChallengeTag = {
  id: string;
  name: string;
};

export type ChallengeSearchResultItem = {
  id: string;
  name: string;
  task: string;
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
};
