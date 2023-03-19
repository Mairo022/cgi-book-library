import { FormEvent, useEffect, useState } from "react";
import { getCheckouts } from "../services/checkoutService";
import { IFilterParams, IPage, IPageRequest, ISortDirection } from "../types/page";
import { useNavigate } from "react-router-dom";
import { ICheckout } from "../types/checkout";
import generatePages from "../utils/pagination";

function CheckoutsList(): JSX.Element {
    const [checkouts, setCheckouts] = useState<IPage<ICheckout>>()
    const [filter, setFilter] = useState<Partial<IFilterParams>>({pageIndex: 0, pageSize: 5, sort: "dueDate", direction: "asc"})
    const [dataLoadError, setDataLoadError] = useState<boolean>(false)

    const navigate = useNavigate()

    const [title, setTitle] = useState<string>("")
    const [author, setAuthor] = useState<string>("")
    const [year, setYear] = useState<number>()
    const [firstname, setFirstname] = useState<string>("")
    const [lastname, setLastname] = useState<string>("")
    const [late, setLate] = useState<boolean>(false)


    function loadCheckouts(filter: Partial<IPageRequest>): void {
        getCheckouts(filter)
            .then(r => {
                setCheckouts(r.data)
                console.log(r.data)
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
        setFilter({...filter, pageIndex: 0, title, author, year, borrowerFirstName: firstname, borrowerLastName: lastname, late})
    }

    function searchJSX(): JSX.Element {
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
                    <div className="table_search__form__field table_search__form__field__year">
                        <label htmlFor="year">Year</label>
                        <input type="number" value={String(year)} name="year" onChange={e => {setYear(parseInt(e.target.value))}}/>
                    </div>
                    <div className="table_search__form__field">
                        <label htmlFor="fname">First Name</label>
                        <input type="text" value={firstname} name="fname" onChange={e => {setFirstname(e.target.value)}}/>
                    </div>
                    <div className="table_search__form__field">
                        <label htmlFor="lname">Last Name</label>
                        <input type="text" value={lastname} name="lname" onChange={e => {setLastname(e.target.value)}}/>
                    </div>
                    <div className="table_search__form__field table_search__form__field__late">
                        <label htmlFor="late">Late</label>
                        <input type="checkbox" name="late" onChange={() => {setLate(state => !state)}}/>
                    </div>
                    <button className="table_search__form__submit" type="submit">Search</button>
                </form>
            </>
        )
    }

    function checkoutsJSX(): JSX.Element[] {
        const checkoutsJSX: JSX.Element[] = checkouts!.content.map((checkout, i) => {
            const today = new Date()
            const dueDate = new Date(checkout.checkedOutDate)
            const className = today > dueDate && checkout.returnedDate === null ? "table__body__row__due--late" : undefined

            return (
                <tr onClick={() => { navigate(`/checkouts/${checkout.id}`) }} key={i}>
                    <td data-label="Title">{checkout.borrowedBook.title}</td>
                    <td data-label="Author">{checkout.borrowedBook.author}</td>
                    <td data-label="Year">{checkout.borrowedBook.year}</td>
                    <td data-label="First Name">{checkout.borrowerFirstName}</td>
                    <td data-label="Last Name">{checkout.borrowerLastName}</td>
                    <td data-label="Checked out">{checkout.checkedOutDate}</td>
                    <td className={className} data-label="Due">{checkout.dueDate}</td>
                </tr>
            )
        })
        return checkoutsJSX
    }

    function navPages(): JSX.Element {
        const pageCur = checkouts!.number + 1
        const pagesTotal = checkouts!.totalPages
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
        loadCheckouts(filter)
    }, [filter])

    return checkouts && checkouts.content ?
           <div className="checkouts__list">
               <div className="table_search">
                   {searchJSX()}
               </div>
               <table className="table">
                   <thead className="table__headers">
                   <tr>
                       <th className="table__headers__title" scope="col" onClick={() => { handleSorting("borrowedBook") }}>
                           Title
                       </th>
                       <th className="table__headers__author" scope="col" onClick={() => { handleSorting("borrowedBookAuthor") }}>
                           Author
                       </th>
                       <th className="table__headers__year" scope="col" onClick={() => { handleSorting("borrowedBookYear") }}>
                           Year
                       </th>
                       <th className="table__headers__fname" scope="col" onClick={() => { handleSorting("borrowerFirstName") }}>
                           First name
                       </th>
                       <th className="table__headers__lname" scope="col" onClick={() => { handleSorting("borrowerLastName") }}>
                           Last name
                       </th>
                       <th className="table__headers__checkedOut" scope="col" onClick={() => { handleSorting("checkedOutDate") }}>
                           Checked out
                       </th>
                       <th className="table__headers__due" scope="col" onClick={() => { handleSorting("dueDate") }}>
                           Due
                       </th>
                   </tr>
                   </thead>
                   <tbody className="table__body">
                        {checkoutsJSX()}
                   </tbody>
               </table>
               <nav className="table_nav">
                   {navPages()}
               </nav>
           </div>
           : dataLoadError ?
             <div className="error_loading">
                 <p className="error_loading__text">Error loading books,</p>
                 <a className="error_loading__reload" href=".">try again</a>
             </div>
           : <p className="loading_data">Loading</p>
}

export default CheckoutsList