import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getBook } from "../services/bookService";
import { IBook } from "../types/book";
import BookCheckoutDialogue from "./BookCheckoutDialogue";

function BookDetail(): JSX.Element {
    const [book, setBook] = useState<IBook>()
    const location = useLocation()
    const bookId: string = location.pathname.split("/books/")[1]
    const [showCheckoutDialogue, setShowCheckoutDialogue] = useState(false)
    const [showEditDialogue, setShowEditDialogue] = useState(true)

    function loadBook(bookId: string): void {
        getBook(bookId)
            .then(r => {
                setBook(r.data)
            })
    }

    function bookJSX(): JSX.Element {
        if (!book) {
            return <p className="loading">Loading</p>
        }

        const checkoutJSX: JSX.Element = book.status === "AVAILABLE" || book.status === "RETURNED"
                                         ? <button className="book__checkout" onClick={() => { setShowCheckoutDialogue(state => !state) }}>Checkout</button>
                                         : <></>

        const checkoutStateJSX: JSX.Element = book.status !== "AVAILABLE" && book.status !== "RETURNED"
                                              ? <NavLink to="/checkouts/" className="book__checkout_state">Checkout status</NavLink>
                                              : <></>

        return (
            <section className="book">
                <h4 className="book__title">{book.title}</h4>
                <p className="book__author">By {book.author}</p>
                <p className="book__genre">{book.genre}</p>
                <p className="book__added">{book.added}</p>
                <p className="book__status">{book.status}</p>
                <button onClick={() => { setShowEditDialogue(state => !state)}}>Edit status</button>
                {checkoutJSX}
            </section>
        )
    }

    useEffect(() => {
        loadBook(bookId)
    }, [])

    return (
        <>
            {showCheckoutDialogue && <BookCheckoutDialogue/>}
            {bookJSX()}
        </>
    )
}

export default BookDetail