export interface ApiResponse<T> {
  data: T;
  message: string;
  error: boolean | string;
  pagination?: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}
