import { ChallengeSelectorType } from 'app/types/enums/challengeSelectorType';
import { GameMode } from 'app/types/enums/gameMode';
import { Language } from 'app/types/enums/language';

export function getLanguageKeyName(value: string) {
  return Object.entries(Language).find(([key, val]) => val == value)?.[0];
}

export function getGameModeKeyName(value: string) {
  return Object.entries(GameMode).find(([key, val]) => val == value)?.[0];
}

export function getChallengeSelectorTypeKeyName(value: string) {
  return Object.entries(ChallengeSelectorType).find(([key, val]) => val == value)?.[0];
}
