export enum Language {
  csharp = 'C#',
  javascript = 'JavaScript',
  typescript = 'TypeScript',
  //java = 'Java',
}

export const getLanguageKeyName = (value: string) => {
  return Object.entries(Language).find(([key, val]) => val == value)?.[0];
}