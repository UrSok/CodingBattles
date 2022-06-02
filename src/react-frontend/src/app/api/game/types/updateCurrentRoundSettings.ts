type UpdateCurrentRoundSettingsRequest = {
  duration: number;
  gameMode: string;
  restrictedLanguages: string[];
  challengeSelectorType: string;
};

export type UpdateCurrentRoundSettingsWithParameters = {
  gameId: string;
  request: UpdateCurrentRoundSettingsRequest;
}
