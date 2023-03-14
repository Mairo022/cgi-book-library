import axios, { AxiosPromise } from "axios";
import buildFilterParams from "./restUtil";
import { IPage, IPageRequest } from "../types/page";
import { IBook } from "../types/book";

const baseUrl = `http://localhost:8080/api/book`

function getBooks(filter: Partial<IPageRequest>): AxiosPromise<IPage<IBook>> {
    const url = baseUrl + '/getBooks'
    const params = buildFilterParams(filter)
    return axios.get(url + params)
}

function getBook(bookId: string): AxiosPromise<IBook> {
    const url = baseUrl + '/getBook'
    const params = `?bookId=${bookId}`
    return axios.get(url + params)
}

function saveBook(book: IBook): AxiosPromise<void> {
    const url = baseUrl + '/saveBook'
    return axios.post(url, book)
}

function deleteBook(bookId: string): AxiosPromise<void> {
    const url = baseUrl + '/deleteBook'
    const params = `?bookId=${bookId}`
    return axios.delete(url + params)
}

export {
    getBooks,
    getBook,
    saveBook,
    deleteBook
}