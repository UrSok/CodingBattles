interface Error {
  name: string;
  value: number;
}

export type Result = {
  errors?: Error[];
  isSuccess: boolean;
};

export type ResultWithValue<T> = {
  errors?: Error[];
  isSuccess: boolean;
  value?: T;
};

export enum ApiException {
  Status500 = '500',
  Unknown = 'Unknown',
  ServerUnreachable = 'Unreacheble',
}
