import { ChallengeSelectorType } from 'app/types/enums/challengeSelectorType';
import { GameMode } from 'app/types/enums/gameMode';
import { RoundStatus } from 'app/types/enums/roundStatus';
import { Challenge } from '../challenge/challenge';
import { RoundSummary } from './roundSummary';

export type Round = {
  number: number;
  status: RoundStatus;
  gameMode: GameMode;
  restrictedLanguages: string[];
  challengeSelectorType: ChallengeSelectorType;
  startTime?: Date;
  durationMinutes: number;
  challenge: Challenge;
  roundSummaries: RoundSummary[];
};
