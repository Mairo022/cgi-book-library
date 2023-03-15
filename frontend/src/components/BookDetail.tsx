import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getBook } from "../services/bookService";
import { IBook } from "../types/book";
import BookCheckoutDialogue from "./BookCheckoutDialogue";
import { useUserDetails } from "../context/userContext";

function BookDetail(): JSX.Element {
    const [book, setBook] = useState<IBook>()
    const {role} = useUserDetails()
    const location = useLocation()
    const bookId: string = location.pathname.split("/books/")[1]

    const [showCheckoutDialogue, setShowCheckoutDialogue] = useState(false)

    function loadBook(bookId: string): void {
        getBook(bookId)
            .then(r => {
                setBook(r.data)
            })
    }

    function bookJSX(): JSX.Element {
        if (!book) return <></>

        const checkoutButton = book.status!== "BORROWED" && (role === "reader" || role === "librarian")
                               ? <button onClick={() => { setShowCheckoutDialogue(true) }}>Checkout</button>
                               : <></>

        return (
            <section className="book">
                <h4 className="book__title">{book.title}</h4>
                <p className="book__author">by {book.author}</p>
                <p className="book__genre">Genre: {book.genre}</p>
                <p className="book__added">Released: {book.year}</p>
                <p className="book__status">Status: {book.status}</p>
                {checkoutButton}
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