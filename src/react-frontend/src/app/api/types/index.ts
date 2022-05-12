export enum ErrorCode {
  StubGeneratorError = 'StubGeneratorError',
  InvalidId = 'InvalidId',
  ChallengeNotFound = 'ChallengeNotFound',
  TestNotPassed = 'TestNotPassed',
  ValidatorNotPassed = 'ValidatorNotPassed',
  BuildError = 'BuildError',
}

export type Error = {
  name: string;
  value: number;
};

export type Result = {
  errors?: Error[];
  isSuccess: boolean;
};

export type ResultValue<T> = {
  errors?: Error[];
  isSuccess: boolean;
  value?: T;
};

export enum OrderStyle {
  None = 0,
  Ascend = 1,
  Descend = 2,
}

export type Paginated<T> = {
  totalPages: number;
  totalItmes: number;
  items: T[];
};
