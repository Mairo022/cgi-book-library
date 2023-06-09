import { IBookReturnDialogue } from "../types/bookReturnDialogue";
import { saveCheckout } from "../services/checkoutService";
import { saveBook } from "../services/bookService";
import React, { useState } from "react";
import { IBook, IBookStatus } from "../types/book";
import { STATUSES } from "../utils/statuses";
import axios from "axios";
import { ICheckout } from "../types/checkout";
import { toTitleCase } from "../utils/toTitleCase";
import "../styles/components/bookReturnDialogue.scss"

function BookReturnDialogue(props: IBookReturnDialogue): JSX.Element {
    const {checkout, open, setOpen, setCheckout} = props
    const [status, setStatus] = useState<IBookStatus>("RETURNED")

    function onSave(): void {
        const returnedDate = status === "BORROWED" ? null : new Date().toLocaleDateString("sv-SE")

        const checkoutData: ICheckout = {...checkout, returnedDate: returnedDate}
        const bookData: IBook = {...checkout.borrowedBook, status}

        axios.all([saveBook(bookData), saveCheckout(checkoutData)])
            .then(() => {
                setCheckout(checkoutData)
                setOpen(false)
            })
    }

    function selectStatusJSX(): JSX.Element {
        const statuses: JSX.Element[] = STATUSES.map((status, i) => {
            return (
                <option className="content__select__option" value={status} key={i}>
                    {toTitleCase(status)}
                </option>
            )
        })
        return (
            <select className="book__status__select" name="statuses" onChange={e => {setStatus(e.target.value as IBookStatus)}}>
                {statuses}
            </select>
        )
    }

    return (
        <dialog className="book_return_dialogue dialogue" open={open} modal="false" role="dialog">
            <header className="header">
                <h4 className="header__title">Returning Book</h4>
            </header>
            <article className="content">
                <p className="content__title">{checkout.borrowedBook.title}</p>
                <p className="content__author">by {checkout.borrowedBook.author}</p>
                <p className="content__year">{checkout.borrowedBook.year}</p>
                {selectStatusJSX()}
            </article>
            <div className="options">
                <button className="options__yes" onClick={() => { onSave() }}>Save</button>
                <button className="options__no" onClick={() => { setOpen(false) }}>Cancel</button>
            </div>
        </dialog>
    )
}

export default BookReturnDialogue