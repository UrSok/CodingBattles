import { OrderStyle } from 'app/types/enums/orderStyle';

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
