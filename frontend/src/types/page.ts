import { IBookStatus } from "./book";

export type ISortDirection = 'asc' | 'desc' | '';
export type IParameters = "page" | "size" | "sort" | "author" | "year" | "title" | "genre" | "status"

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

export interface IFilterParams extends IPageRequest {
    title: string
    author: string
    year: number
    genre: string
    status: IBookStatus | ""
}