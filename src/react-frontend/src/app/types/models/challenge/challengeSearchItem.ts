import { ChallengeStatus } from 'app/types/enums/challengeStatus';
import { ChallengeTag } from './challengeTag';

export type ChallengeSearchItem = {
  id: string;
  createdByUserId: string;
  name: string;
  descriptionShort: string;
  difficulty: number;
  status: ChallengeStatus;
  tags: ChallengeTag[];
};
