import { Challenge } from '../challenge/challenge';
import { RoundSummary } from './roundSummary';

export type Round = {
  number: number;
  startTime?: Date;
  durationMinutes: number;
  challenge: Challenge;
  roundSummaries: RoundSummary[];
};
