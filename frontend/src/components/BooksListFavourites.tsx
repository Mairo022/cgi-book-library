import { useUserDetails } from "../context/userContext";
import { useEffect, useState } from "react";
import { IPageRequest, ISortDirection } from "../types/page";
import { IBook } from "../types/book";
import { getBook } from "../services/bookService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toTitleCase } from "../utils/toTitleCase";

function BooksListFavourites(): JSX.Element {
    const {favouriteBooks} = useUserDetails()
    const navigate = useNavigate()

    const [books, setBooks] = useState<IBook[]>()
    const [filter, setFilter] = useState<Partial<IPageRequest>>({sort: "title", direction: "asc"})
    const [dataLoadError, setDataLoadError] = useState<boolean>(false)

    function loadBooks(): void {
        let requests: Array<() => Promise<any>> = []

        favouriteBooks.forEach(async(bookId) => {
            const request = () => getBook(bookId)
            requests.push(request)
        })

        axios.all(requests.map(req => req()))
            .then(responses => {
                let books: Array<IBook> = []

                responses.forEach(response => {
                    books.push(response.data)
                })
                setBooks(books)
            })
            .catch(() => {
                setDataLoadError(true)
            })
    }

    function onSort(sort: string): void {
        if (!books) return
        const direction: ISortDirection = filter.sort === sort && filter.direction === "asc" ? "desc" : "asc"

        const sortedData = books.sort((a, b) =>
            compare(a[sort as keyof IBook], b[sort as keyof IBook], direction === "asc"))

        setFilter({sort, direction})
        setBooks(sortedData)
    }

    // Code source https://material.angular.io/components/sort/overview
    function compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    function booksJSX(): JSX.Element[] {
        const booksJSX: JSX.Element[] = books!.map((book, i) =>
                <tr onClick={() => { navigate(`/books/${book.id}`) }} key={i}>
                    <td data-label="Title">{book.title}</td>
                    <td data-label="Author">{book.author}</td>
                    <td data-label="Year">{book.year}</td>
                    <td data-label="Genre">{book.genre}</td>
                    <td data-label="Status">{toTitleCase(book.status)}</td>
                </tr>
            )
        return booksJSX
    }

    useEffect(() => {
        loadBooks()
    }, [favouriteBooks])

    return books ?
           <div className="books__list">
               <table className="table">
                   <thead className="table__headers">
                   <tr>
                       <th className="table__headers__title" scope="col" onClick={() => { onSort("title") }}>
                           Title
                       </th>
                       <th className="table__headers__author" scope="col" onClick={() => { onSort("author") }}>
                           Author
                       </th>
                       <th className="table__headers__year" scope="col" onClick={() => { onSort("year") }}>
                           Year
                       </th>
                       <th className="table__headers__genre" scope="col" onClick={() => { onSort("genre") }}>
                           Genre
                       </th>
                       <th className="table__headers__status" scope="col" onClick={() => { onSort("status") }}>
                           Status
                       </th>
                   </tr>
                   </thead>
                   <tbody className="table__body">
                        {booksJSX()}
                   </tbody>
               </table>
           </div>
           : dataLoadError ?
             <div className="error_loading">
                 <p className="error_loading__text">Error loading books,</p>
                 <a className="error_loading__reload" href=".">try again</a>
             </div>
           : <p className="loading_data">Loading</p>

}

export default BooksListFavourites