export type ServerActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type SortOption = {
  label: string;
  fieldName: string;
};

export type SortConfig = {
  [key: string]: 1 | -1;
};

export type PaginationQuerySearchParams = {
  q?: string;
  page?: string;
  sortDir?: string;
  sortByField?: string;
};

export type ParsedPaginationQuerySearchParams = {
  q?: string;
  page: number;
  sortDir?: 1 | -1;
  sortByField?: string;
};
