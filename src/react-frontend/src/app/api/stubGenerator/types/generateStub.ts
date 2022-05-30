export type GenerateStubError = {
  line: number;
  validationCode: string;
  culpritName: string;
};

export type GenerateStubRequest = {
  language: string;
  input?: string;
};

export type GenerateStubResult = {
  stub: string;
  error?: GenerateStubError;
};
