import { Solution } from 'app/types/models/general/solution';

export type SubmitResultRequest = {
  gameId: string;
  userId: string;
  solution: Solution;
};
