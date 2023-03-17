import { useEffect, useState } from "react";
import { getCheckouts } from "../services/checkoutService";
import { IPage, IPageRequest, ISortDirection } from "../types/page";
import { NavLink } from "react-router-dom";
import { ICheckout } from "../types/checkout";
import generatePages from "../utils/pagination";

function CheckoutsList(): JSX.Element {
    const [checkouts, setCheckouts] = useState<IPage<ICheckout>>()
    const [filter, setFilter] = useState<Partial<IPageRequest>>({pageIndex: 0, pageSize: 5, sort: "dueDate", direction: "asc"})
    const [dataLoadError, setDataLoadError] = useState<boolean>(false)

    function loadCheckouts(filter: Partial<IPageRequest>): void {
        getCheckouts(filter)
            .then(r => {
                setCheckouts(r.data)
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
                <button onClick={() => { handleSorting("borrowedBook") }}>
                    Title
                </button>
                <button onClick={() => { handleSorting("borrowedBookAuthor") }}>
                    Author
                </button>
                <button onClick={() => { handleSorting("borrowedBookYear") }}>
                    Year
                </button>
                <button onClick={() => { handleSorting("borrowerFirstName") }}>
                    First name
                </button>
                <button onClick={() => { handleSorting("borrowerLastName") }}>
                    Last name
                </button>
                <button onClick={() => { handleSorting("checkedOutDate") }}>
                    Checked out
                </button>
                <button onClick={() => { handleSorting("dueDate") }}>
                    Due
                </button>
            </>
        )

        return headersJSX
    }

    function checkoutsJSX(): JSX.Element[] {
        const checkoutsJSX: JSX.Element[] = checkouts!.content.map((checkout, index) => {
            return (
                <li className="table__row" key={index}>
                    <NavLink to={checkout.id} className="table__row__item">
                        <p className="table__row__item__title">{checkout.borrowedBook.title}</p>
                        <p className="table__row__item__author">{checkout.borrowedBook.author}</p>
                        <p className="table__row__item__year">{checkout.borrowedBook.year}</p>
                        <p className="table__row__item__firstname">{checkout.borrowerFirstName}</p>
                        <p className="table__row__item__lastname">{checkout.borrowerLastName}</p>
                        <p className="table__row__item__checkedOut">{checkout.checkedOutDate}</p>
                        <p className="table__row__item__dueDate">{checkout.dueDate}</p>
                    </NavLink>
                </li>
            )
        })
        return checkoutsJSX
    }

    function navPages(): JSX.Element {
        const pageCur = checkouts!.number + 1
        const pagesTotal = checkouts!.totalPages
        const pages = generatePages(pageCur, pagesTotal, 5)

        const pagesJSX: JSX.Element[] = pages.map((page, index) => {
            const className: string = page === pageCur ? "table__nav__pages__page table__nav__pages__page--active" : "table__nav__pages__page"

            return (
                <button className={className} key={index} onClick={() => { handlePaging(page-1) }}>
                    {page}
                </button>
            )
        })

        const navJSX: JSX.Element = (
            <>
                <button className="table__nav__first" onClick={() => { handlePaging(0) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/><path d="M24 24H0V0h24v24z" fill="none"/></svg>
                </button>
                <button className="table__nav__previous" onClick={() => { handlePaging(pageCur-2) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
                {pagesJSX}
                <button className="table__nav__next" onClick={() => { handlePaging(pageCur) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                <button className="table__nav__last" onClick={() => { handlePaging(pagesTotal-1) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/></svg>
                </button>
            </>
        )

        return navJSX
    }

    useEffect(() => {
        loadCheckouts(filter)
    }, [filter])

    return checkouts && checkouts.content ?
           <article className="table checkouts">
               <header className="table__headers">
                   {headersJSX()}
               </header>
               <ul className="table__rows">
                   {checkoutsJSX()}
               </ul>
               <nav className="table__nav">
                   {navPages()}
               </nav>
           </article>
           : dataLoadError ?
             <div className="error_loading">
                 <p className="error_loading__text">Error loading books,</p>
                 <a className="error_loading__reload" href=".">try again</a>
             </div>
           : <p className="loading_data">Loading</p>
}

export default CheckoutsList