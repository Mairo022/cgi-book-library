import { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import { IBook } from "../types/book";
import { IPage, IPageRequest, ISortDirection } from "../types/page";
import { NavLink } from "react-router-dom";
import "../styles/table.scss"

function BooksList(): JSX.Element {
    const [books, setBooks] = useState<IPage<IBook>>()
    const [filter, setFilter] = useState<Partial<IPageRequest>>({pageIndex: 0, pageSize: 5, sort: "title", direction: "asc"})
    const [dataLoadError, setDataLoadError] = useState<boolean>(false)

    function loadBooks(filter: Partial<IPageRequest>): void {
        getBooks(filter)
            .then(r => {
                setBooks(r.data)
            })
            .catch(() => {
                setDataLoadError(true)
            })
    }

    function handlePaging(page: number): void {
        if (filter.pageIndex === page) return
        setFilter((filter) => ({...filter, pageIndex: page}))
    }

    function handleSorting(sort: string): void {
        let direction: ISortDirection = "asc"

        if (filter.sort === sort) {
            if (filter.direction === "asc") {
                direction = "desc"
            }
        }
        setFilter((filter => ({...filter, sort, direction, pageIndex: 0})))
    }

    function headersJSX(): JSX.Element {
        const headersJSX: JSX.Element = (
            <>
                <button onClick={() => { handleSorting("title") }}>
                    Title
                </button>
                <button onClick={() => { handleSorting("author") }}>
                    Author
                </button>
                <button onClick={() => { handleSorting("year") }}>
                    Year
                </button>
                <button onClick={() => { handleSorting("genre") }}>
                    Genre
                </button>
                <button onClick={() => { handleSorting("status") }}>
                    Status
                </button>
            </>
        )

        return headersJSX
    }

    function booksJSX(): JSX.Element[] {
        const booksJSX: JSX.Element[] = books!.content.map((book, index) => {
            return (
                <li className="table__row" key={index}>
                    <NavLink to={book.id} className="table__row__book table__row__item">
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

    function navPagesJSX(): JSX.Element {
        const displayedPages: number = 5;
        const pagesFromMidPoint: number = Math.floor(displayedPages/2);
        const pageCur: number = books!.number+1;
        const pagesTotal: number  = books!.totalPages;
        const pages: Array<number> = []

        let startPage: number, endPage: number = 0

        // Less pages than the amount of displayed pages
        if (pagesTotal <= displayedPages) {
            startPage = 1;
            endPage = pagesTotal;
        // Less pages in first half
        } else if (pageCur <= pagesFromMidPoint + 1) {
            startPage = 1;
            endPage = displayedPages;
        // Less pages in second half
        } else if (pageCur >= pagesTotal - pagesFromMidPoint) {
            endPage = pagesTotal;
            startPage = pagesTotal - displayedPages + 1;
        // Equal amount of pages on both sides
        } else {
            startPage = pageCur - pagesFromMidPoint;
            endPage = pageCur + pagesFromMidPoint;
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        const pagesJSX: JSX.Element[] = pages.map((page, index) => {
            const className: string = page === pageCur ? "table__nav__pages__page table__nav__pages__page--active" : "table__nav__pages__page"

            return (
                <button className={className} key={index} onClick={() => { handlePaging(page-1) }}>
                    {page}
                </button>
            )
        })

        const navJSX: JSX.Element = (
            <div className="table__nav__pages">
                <button className="table__nav__pages__first" onClick={() => { handlePaging(0) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/><path d="M24 24H0V0h24v24z" fill="none"/></svg>
                </button>
                <button className="table__nav__pages__previous" onClick={() => { handlePaging(pageCur-2) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                {pagesJSX}
                <button className="table__nav__pages__next" onClick={() => { handlePaging(pageCur) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
                <button className="table__nav__pages__last" onClick={() => { handlePaging(pagesTotal-1) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/></svg>
                </button>
            </div>
        )

        return navJSX
    }

    useEffect(() => {
        loadBooks(filter)
    }, [filter])

    return books && books.content ?
           <article className="table books_list">
               <header className="table__headers">
                   {headersJSX()}
               </header>
               <ul className="table__rows">
                   {booksJSX()}
               </ul>
               <nav className="table__nav">
                   {navPagesJSX()}
               </nav>
           </article>
           : dataLoadError ?
             <div className="error_loading">
               <p className="error_loading__text">Error loading books,</p>
               <a className="error_loading__reload" href=".">try again</a>
             </div>
           : <p className="loading_data">Loading</p>

}

export default BooksList