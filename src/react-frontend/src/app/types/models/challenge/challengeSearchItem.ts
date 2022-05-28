import { ChallengeTag } from './challengeTag';

export type ChallengeSearchItem = {
  id: string;
  createdByUserId: string;
  name: string;
  descriptionShort: string;
  difficulty: number;
  tags: ChallengeTag[];
};
