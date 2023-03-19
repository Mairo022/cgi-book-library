import { IBookDeleteDialogue } from "../types/bookDeleteDialogue";
import React from "react";
import { deleteBook } from "../services/bookService";
import { useNavigate } from "react-router-dom";
import "../styles/components/bookDeleteDialogue.scss"

function BookDeleteDialogue(props: IBookDeleteDialogue): JSX.Element {
    const {open, setOpen, book} = props
    const navigate = useNavigate()

    function onDelete(bookId: string): void {
        deleteBook(bookId)
            .then(() => {
                navigate("/books")
            })
    }

    return (
        <dialog className="book_return_dialogue dialogue" open={open} modal="false" role="dialog">
            <header className="header">
                <h3 className="header__title">Delete Book</h3>
            </header>
            <article className="content">
                <p className="content__title">{book.title}</p>
                <p className="content__author">by {book.author}</p>
                <p className="content__year">{book.year}</p>
            </article>
            <div className="options">
                <button className="options__yes" onClick={() => { onDelete(book.id) }}>Yes</button>
                <button className="options__no" onClick={() => { setOpen(false) }}>No</button>
            </div>
        </dialog>
    )
}

export default BookDeleteDialogue