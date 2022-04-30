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

export enum ApiException {
  Status500 = '500',
  Unknown = 'Unknown',
  ServerUnreachable = 'Unreacheble',
}

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