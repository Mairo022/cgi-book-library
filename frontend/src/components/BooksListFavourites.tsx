import { useUserDetails } from "../context/userContext";
import { useEffect, useState } from "react";
import { IPage, IPageRequest, ISortDirection } from "../types/page";
import { IBook } from "../types/book";
import { getBook } from "../services/bookService";
import { NavLink } from "react-router-dom";
import axios from "axios";

function BooksListFavourites(): JSX.Element {
    const {favouriteBooks} = useUserDetails()

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

    function headersJSX(): JSX.Element {
        const headersJSX: JSX.Element = (
            <>
                <button onClick={() => { onSort("title") }}>
                    Title
                </button>
                <button onClick={() => { onSort("author") }}>
                    Author
                </button>
                <button onClick={() => { onSort("year") }}>
                    Year
                </button>
                <button onClick={() => { onSort("genre") }}>
                    Genre
                </button>
                <button onClick={() => { onSort("status") }}>
                    Status
                </button>
            </>
        )

        return headersJSX
    }

    function booksJSX(): JSX.Element[] {
        const booksJSX: JSX.Element[] = books!.map((book, index) => {
            return (
                <li className="table__row" key={index}>
                    <NavLink to={`/books/${book.id}`} className="table__row__book table__row__item">
                        <p className="table__row__item__title">{book.title}</p>
                        <p className="table__row__item__author">{book.author}</p>
                        <p className="table__row__item__year">{book.year}</p>
                        <p className="table__row__item__genre">{book.genre}</p>
                        <p className="table__row__item__status">{book.status}</p>
                    </NavLink>
                </li>
            )
        })

        return booksJSX
    }

    useEffect(() => {
        loadBooks()
    }, [favouriteBooks])

    return books ?
           <article className="table books_list">
               <header className="table__headers">
                   {headersJSX()}
               </header>
               <ul className="table__rows">
                   {booksJSX()}
               </ul>
               <footer className="table__footer">
               </footer>
           </article>
           : dataLoadError ?
             <div className="error_loading">
                 <p className="error_loading__text">Error loading books,</p>
                 <a className="error_loading__reload" href=".">try again</a>
             </div>
           : <p className="loading_data">Loading</p>

}

export default BooksListFavourites