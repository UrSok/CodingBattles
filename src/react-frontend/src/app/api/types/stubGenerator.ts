export type StubGeneratorModel = {
  language: string;
  input: string;
};

export type StubGeneratorError = {
  line: number;
  validationCode: string;
  culpritName: string;
};

export type StubGeneratorResult = {
  stub: string;
  error?: StubGeneratorError;
};
