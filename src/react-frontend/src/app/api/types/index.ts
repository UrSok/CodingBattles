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
