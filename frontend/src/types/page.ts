export type ISortDirection = 'asc' | 'desc' | '';
export type IParameters = "page" | "size" | "sort"

/**
 * Page as returned from spring pageable endpoints.
 */
export interface IPage<T> {
    content: T[];
    totalElements: number;
    number: number; // page number
    totalPages: number;
}

/**
 * Object for creating page request to spring pageable endpoints.
 */
export interface IPageRequest {
    pageIndex: number;
    pageSize: number;
    sort?: string;
    direction?: ISortDirection;
}