import { useLocation } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from "react";
import { getBook, saveBook } from "../services/bookService";
import { IBook, IBookStatus } from "../types/book";
import BookCheckoutDialogue from "./BookCheckoutDialogue";
import { useUserDetails } from "../context/userContext";
import React from 'react';
import { IFavouriteBooks } from "../types/contextTypes";
import { STATUSES } from "../utils/statuses";

function BookDetail(): JSX.Element {
    const [book, setBook] = useState<IBook>()
    const {role, favouriteBooks, setFavouriteBooks} = useUserDetails()
    const location = useLocation()
    const bookId: string = location.pathname.split("/books/")[1]

    const [showCheckoutDialogue, setShowCheckoutDialogue] = useState(false)

    function loadBook(bookId: string): void {
        getBook(bookId)
            .then(r => {
                setBook(r.data)
            })
    }

    function onSelectionChange(e: ChangeEvent<HTMLSelectElement>) {
        const status = e.target.value as IBookStatus

        if (!STATUSES.includes(status) || !book) return

        const bookData: IBook = {...book, status}
        saveBook(bookData)
    }

    function onFavouriting(action: "ADD" | "REMOVE"): void {
        if (action === "ADD") {
            const favourites: IFavouriteBooks = [...favouriteBooks, String(book!.id)]

            localStorage.setItem("favourites", JSON.stringify(favourites))
            setFavouriteBooks(favourites)
        }
        if (action === "REMOVE") {
            const favourites: IFavouriteBooks = favouriteBooks.filter(id => id !== book!.id)

            localStorage.setItem("favourites", JSON.stringify(favourites))
            setFavouriteBooks(favourites)
        }
    }

    function bookJSX(): JSX.Element {
        if (!book) return <></>

        const isBookInFavourites = favouriteBooks?.includes(book.id)

        const selectOptions = STATUSES.map((status, i) => {
            const statusTitleCase: string = status.charAt(0) + status.slice(1).toLowerCase()

            // Ensures the first option is book.status
            if (i === 0) {
                if (status !== book.status) {
                    return (
                        <React.Fragment key={i}>
                            <option className="book__status__select__option" value={book.status}>
                                {
                                    book.status.charAt(0) + book.status.slice(1).toLowerCase()
                                }
                            </option>
                            <option className="book__status__select__option" value={status}>
                                {statusTitleCase}
                            </option>
                        </React.Fragment>
                    )
                }
                return (
                    <option className="book__status__select__option" value={status} key={i}>
                        {statusTitleCase}
                    </option>
                )
            }
            if (status === book.status) {
                return <React.Fragment key={i}/>
            }

            return (
                <option className="book__status__select__option" value={status} key={i}>
                    {statusTitleCase}
                </option>
            )
        })

        const bookStatus: JSX.Element = role === "librarian" && book.status !== "BORROWED"
                                        ? <div className="book__status">
                                            <label htmlFor="statuses">Status: </label>
                                            <select className="book__status__select" name="statuses" onChange={onSelectionChange}>
                                                {selectOptions}
                                            </select>
                                          </div>
                                        : <p className="book__status">Status: {book.status}</p>

        const checkoutButton: JSX.Element = book.status!== "BORROWED" && (role === "reader" || role === "librarian")
                                            ? <button onClick={() => {setShowCheckoutDialogue(true)}}>Checkout</button>
                                            : <></>

        const favouriteButton = (): JSX.Element => {
            if (role === "reader") {
                return isBookInFavourites
                       ? <button onClick={() => {onFavouriting("REMOVE")}}>Unfavourite</button>
                       : <button onClick={() => {onFavouriting("ADD")}}>Favourite</button>
            }
            return <></>
        }

        return (
            <section className="book">
                <h4 className="book__title">{book.title}</h4>
                <p className="book__author">by {book.author}</p>
                <p className="book__genre">Genre: {book.genre}</p>
                <p className="book__added">Released: {book.year}</p>
                {bookStatus}
                {checkoutButton}
                {favouriteButton()}
            </section>
        )
    }

    useEffect(() => {
        loadBook(bookId)
    }, [])


    return book
           ? <>
               <BookCheckoutDialogue book={book} open={showCheckoutDialogue} setOpen={setShowCheckoutDialogue}/>
               {bookJSX()}
            </>
           : <p className="loading">Loading</p>
}

export default BookDetail