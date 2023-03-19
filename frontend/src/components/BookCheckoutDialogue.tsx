import { ICheckout } from "../types/checkout";
import { saveCheckout } from "../services/checkoutService";
import {v4 as uuidv4} from 'uuid';
import "../styles/components/bookCheckoutDialogue.scss"
import { useUserDetails } from "../context/userContext";
import { IBookCheckoutDialogue, IUserData } from "../types/bookCheckoutDialogue";
import { SyntheticEvent, useState } from "react";
import { saveBook } from "../services/bookService";
import axios from "axios";
import { IBook } from "../types/book";

function BookCheckoutDialogue(props: IBookCheckoutDialogue): JSX.Element {
    const {book, open, setOpen} = props
    const {role, firstname, lastname} = useUserDetails()
    const [inputFirstname, setInputFirstname] = useState<string>("")
    const [inputLastname, setInputLastname] = useState<string>("")

    function checkout(userData: IUserData | undefined = undefined): void {
        if (!book) return

        const bookData: IBook = {...book, status: "BORROWED"}
        const checkoutData: ICheckout = {
            borrowedBook: book,
            borrowerFirstName: userData?.firstname ? userData!.firstname : firstname,
            borrowerLastName: userData?.lastname ? userData!.lastname : lastname,
            checkedOutDate: new Date().toLocaleDateString("sv-SE"),
            dueDate: "2025-04-18",
            returnedDate: null,
            id: uuidv4()
        }

        axios.all([saveBook(bookData), saveCheckout(checkoutData)])
    }

    function onSubmit(e: SyntheticEvent): void {
        if (!inputFirstname || !inputLastname) return

        checkout({firstname: inputFirstname, lastname: inputLastname})

        setInputFirstname("")
        setInputLastname("")
        e.preventDefault()
    }

    function checkoutReaderJSX(): JSX.Element {
        return (
            <dialog className="book_checkout_dialogue dialogue" open={open} modal="false" role="dialog">
                <header className="header">
                    <h2 className="header__title">Book Checkout</h2>
                </header>
                <article className="content">
                    <p className="content__title">{book.title}</p>
                    <p className="content__author">by {book.author}</p>
                </article>
                <div className="options">
                    <button className="options__yes" onClick={() => { checkout() }}>Yes</button>
                    <button className="options__no" onClick={() => { setOpen(false) }}>No</button>
                </div>
            </dialog>
        )
    }

    function checkoutLibrarianJSX(): JSX.Element {
        return (
            <dialog className="book_checkout_dialogue dialogue" open={open} modal="false" role="dialog">
                <header className="header">
                    <h3 className="header__title">Book Checkout</h3>
                </header>
                <article className="content">
                    <p className="content__title">{book.title}</p>
                    <p className="content__author">by {book.author}</p>
                    <p className="content__year">{book.year}</p>
                </article>
                <form className="form" onSubmit={(e) => { onSubmit(e) }}>
                    <label className="form__label" htmlFor="firstname">First name</label>
                    <input className="form__input" type="text" id="firstname" value={inputFirstname} onChange={e => { setInputFirstname(e.target.value)}}/>
                    <label className="form__label" htmlFor="lastname">Last name</label>
                    <input className="form__input" type="text" id="lastname" value={inputLastname} onChange={e => { setInputLastname(e.target.value)}}/>
                    <button className="form__submit" type="submit">Checkout</button>
                    <button className="form__cancel" type="reset" onClick={() => { setOpen(false) }}>Cancel</button>
                </form>
            </dialog>
        )
    }

    function displayedJSX(): JSX.Element {
        if (role === "reader") {
            return checkoutReaderJSX()
        }
        if (role === "librarian") {
            return checkoutLibrarianJSX()
        }
        return <></>
    }

    return (
        <>
            {displayedJSX()}
        </>
    )
}

export default BookCheckoutDialogue