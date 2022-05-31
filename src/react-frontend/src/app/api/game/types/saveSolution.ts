import { Solution } from 'app/types/models/general/solution';

export type SaveSolutionWithParameters = {
  gameId: string;
  userId: string;
  solution: Solution;
};
