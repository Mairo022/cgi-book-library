import { FormEvent, useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import { IBook, IBookStatus } from "../types/book";
import { IFilterParams, IPage, ISortDirection } from "../types/page";
import { useNavigate } from "react-router-dom";
import "../styles/table.scss"
import generatePages from "../utils/pagination";
import { STATUSES } from "../utils/statuses";
import { toTitleCase } from "../utils/toTitleCase";

function BooksList(): JSX.Element {
    const [books, setBooks] = useState<IPage<IBook>>()
    const [filter, setFilter] = useState<Partial<IFilterParams>>({pageIndex: 0, pageSize: 5, sort: "title", direction: "asc"})
    const [dataLoadError, setDataLoadError] = useState<boolean>(false)

    const [title, setTitle] = useState<string>("")
    const [author, setAuthor] = useState<string>("")
    const [year, setYear] = useState<number>()
    const [genre, setGenre] = useState<string>("")
    const [status, setStatus] = useState<IBookStatus | "">("")

    const navigate = useNavigate()

    function loadBooks(filter: Partial<IFilterParams>): void {
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

    function onSearchSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault()
        setFilter({...filter, pageIndex: 0, title, author, genre, year, status})
    }

    function searchJSX(): JSX.Element {
        const options = STATUSES.map((status, i) =>
                <option value={status} key={i}>{toTitleCase(status)}</option>)

        return (
            <>
                <form className="table_search__form" onSubmit={onSearchSubmit}>
                    <div className="table_search__form__field">
                        <label htmlFor="title">Title</label>
                        <input type="text" value={title} name="title" onChange={e => {setTitle(e.target.value)}}/>
                    </div>
                    <div className="table_search__form__field">
                        <label htmlFor="author">Author</label>
                        <input type="text" value={author} name="author" onChange={e => {setAuthor(e.target.value)}}/>
                    </div>
                    <div className="table_search__form__field">
                        <label htmlFor="genre">Genre</label>
                        <input type="text" value={genre} name="title" onChange={e => {setGenre(e.target.value)}}/>
                    </div>
                    <div className="table_search__form__field table_search__form__field__year">
                        <label htmlFor="year">Year</label>
                        <input type="number" value={String(year)} name="year" onChange={e => {setYear(parseInt(e.target.value))}}/>
                    </div>
                    <div className="table_search__form__field">
                        <select onChange={e => {setStatus(e.target.value as IBookStatus)}}>
                            <option value="">All</option>
                            {options}
                        </select>
                    </div>
                    <button className="table_search__form__submit" type="submit">Search</button>
                </form>
            </>
        )
    }

    function booksJSX(): JSX.Element[] {
        const booksJSX: JSX.Element[] = books!.content.map((book, i) => {
            return (
                <tr onClick={() => { navigate(`/books/${book.id}`) }} key={i}>
                    <td data-label="Title">{book.title}</td>
                    <td data-label="Author">{book.author}</td>
                    <td data-label="Year">{book.year}</td>
                    <td data-label="Genre">{book.genre}</td>
                    <td data-label="Status">{toTitleCase(book.status)}</td>
                </tr>
            )
        })

        return booksJSX
    }

    function navPagesJSX(): JSX.Element {
        const pageCur = books!.number + 1
        const pagesTotal = books!.totalPages
        const pages = generatePages(pageCur, pagesTotal, 5)

        const pagesJSX: JSX.Element[] = pages.map((page, index) => {
            const className: string = page === pageCur ? "table_nav__page table_nav__page--active" : "table_nav__page"

            return (
                <button className={className} key={index} onClick={() => { handlePaging(page-1) }}>
                    {page}
                </button>
            )
        })

        const navJSX: JSX.Element = (
            <>
                <button className="table_nav__page_btn" onClick={() => { handlePaging(0) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/><path d="M24 24H0V0h24v24z" fill="none"/></svg>
                </button>
                <button className="table_nav__page_btn" onClick={() => { handlePaging(pageCur-2) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                {pagesJSX}
                <button className="table_nav__page_btn" onClick={() => { handlePaging(pageCur) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
                <button className="table_nav__page_btn" onClick={() => { handlePaging(pagesTotal-1) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/></svg>
                </button>
            </>
        )

        return navJSX
    }

    useEffect(() => {
        loadBooks(filter)
    }, [filter])

    return books && books.content ?
           <div className="books__list">
               <div className="table_search">
                   {searchJSX()}
               </div>
               <table className="table">
                   <thead className="table__headers">
                       <tr>
                           <th className="table__headers__title" scope="col" onClick={() => { handleSorting("title") }}>
                               Title
                           </th>
                           <th className="table__headers__author" scope="col" onClick={() => { handleSorting("author") }}>
                               Author
                           </th>
                           <th className="table__headers__year" scope="col" onClick={() => { handleSorting("year") }}>
                               Year
                           </th>
                           <th className="table__headers__genre" scope="col" onClick={() => { handleSorting("genre") }}>
                               Genre
                           </th>
                           <th className="table__headers__status" scope="col" onClick={() => { handleSorting("status") }}>
                               Status
                           </th>
                       </tr>
                   </thead>
                   <tbody className="table__body">
                        {booksJSX()}
                   </tbody>
               </table>
               <nav className="table_nav">
                   {navPagesJSX()}
               </nav>
           </div>
           : dataLoadError ?
             <div className="error_loading">
               <p className="error_loading__text">Error loading books,</p>
               <a className="error_loading__reload" href=".">try again</a>
             </div>
           : <p className="loading_data">Loading</p>

}

export default BooksList