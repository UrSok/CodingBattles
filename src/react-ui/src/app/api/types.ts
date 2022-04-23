export enum OrderStyle {
  None = 0,
  Ascend = 1,
  Descend = 2
}

export type Paginated<T> = {
  totalPages: number;
  totalItmes: number;
  items: T[];
};