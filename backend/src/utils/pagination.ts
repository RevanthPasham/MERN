/**
 * Represents normalized pagination input values.
 * These values are safe to use in database queries.
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Generic shape for paginated API responses.
 * T allows this utility to work with any data type.
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Normalizes incoming pagination values.
 *
 * Rules:
 * - page cannot be less than 1
 * - limit cannot be less than 1
 * - limit cannot be greater than 100
 *
 * This helps prevent invalid queries and very large result sets.
 */
export const getPaginationParams = (
  page: number,
  limit: number
): PaginationParams => {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.min(100, Math.max(1, limit));

  return {
    page: normalizedPage,
    limit: normalizedLimit,
  };
};

/**
 * Calculates the database offset for page-based pagination.
 *
 * Example:
 * - page = 1, limit = 10 => offset = 0
 * - page = 2, limit = 10 => offset = 10
 * - page = 3, limit = 10 => offset = 20
 */
export const getOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Creates a standard paginated response object.
 *
 * Includes:
 * - the current page data
 * - total item count
 * - total number of pages
 * - next/previous page indicators
 */
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};