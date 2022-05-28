export type Paginated<T> = {
  totalPages: number;
  totalItems: number;
  items: T[];
};
