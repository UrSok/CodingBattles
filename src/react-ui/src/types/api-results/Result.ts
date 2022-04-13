interface Error {
  name: string;
  value: number;
}

class Result {
  errors: Error[];
  isSuccess: boolean;

  constructor(data: any) {
    this.errors = data.errors;
    this.isSuccess = data.isSuccess;
  }
}

class ResultWithValue<T> extends Result {
  value: T;

  constructor(data: any) {
    super(data);
    this.value = data.value;
  }
}

export { Result, ResultWithValue };
