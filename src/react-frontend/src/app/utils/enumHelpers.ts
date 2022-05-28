import { Language } from 'app/types/enums/language';

export function getLanguageKeyName(value: string) {
  return Object.entries(Language).find(([key, val]) => val == value)?.[0];
}
