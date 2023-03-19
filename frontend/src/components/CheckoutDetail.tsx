import React, { useEffect, useState } from "react";
import { ICheckout } from "../types/checkout";
import { useLocation } from "react-router-dom";
import { getCheckout, saveCheckout } from "../services/checkoutService";
import { useUserDetails } from "../context/userContext";
import BookReturnDialogue from "./BookReturnDialogue";
import { saveBook } from "../services/bookService";
import { IBook, IBookStatus } from "../types/book";
import axios from "axios";
import "../styles/components/checkoutDetail.scss"

function CheckoutDetail(): JSX.Element {
    const [checkout, setCheckout] = useState<ICheckout>()
    const location = useLocation()
    const checkoutId: string = location.pathname.split("/checkouts/")[1]

    const [showBookReturnDialogue, setShowBookReturnDialogue] = useState<boolean>(false)

    const {role} = useUserDetails()

    function loadCheckout(checkoutId: string): void {
        getCheckout(checkoutId)
            .then(r => {
                setCheckout(r.data)
            })
    }

    function onReturn(): void {
        if (!checkout) return

        if (role === "reader") {
            const checkoutData: ICheckout = {...checkout, returnedDate: new Date().toLocaleDateString("sv-SE")}
            const bookData: IBook = {...checkout.borrowedBook, status: 'PROCESSING' as IBookStatus}

            axios.all([saveBook(bookData), saveCheckout(checkoutData)])
                .then(() => {
                    setCheckout(checkoutData)
                })
        }
        if (role === "librarian") {
            setShowBookReturnDialogue(true)
        }
    }

    function checkoutJSX(): JSX.Element {
        if (!checkout) return <></>

        const returnJSX: JSX.Element = checkout.returnedDate
                                       ? <>
                                            <p className="checkout__borrow__returned_label">Returned</p>
                                            <p className="checkout__borrow__returned">{checkout.returnedDate}</p>
                                       </>
                                       : <button className="checkout__borrow__return" onClick={() => {onReturn()}}>Return</button>

        return (
            <section className="checkout">
                <div className="checkout__book">
                    <h4 className="checkout__book__title">{checkout.borrowedBook.title}</h4>
                    <p className="checkout__book__author">by {checkout.borrowedBook.author}</p>
                    <p className="checkout__book__genre">Genre: {checkout.borrowedBook.genre}</p>
                    <p className="checkout__book__year">Released: {checkout.borrowedBook.year}</p>
                </div>
                <div className="checkout__borrow">
                    <h4 className="checkout__borrow__header">Borrower details</h4>
                    <p className="checkout__borrow__name_label">Name</p>
                    <p className="checkout__borrow__name">{checkout.borrowerFirstName} {checkout.borrowerLastName}</p>
                    <p className="checkout__borrow__checkedOut_label">Checked out</p>
                    <p className="checkout__borrow__checkedOut">{checkout.checkedOutDate}</p>
                    <p className="checkout__borrow__due_label">Due</p>
                    <p className="checkout__borrow__due">{checkout.dueDate}</p>
                    {returnJSX}
                </div>
            </section>
        )
    }

    useEffect(() => {
        loadCheckout(checkoutId)
    }, [])


    return checkout
           ? <>
               { role === "librarian" &&
                   <BookReturnDialogue
                       checkout={checkout}
                       setCheckout={setCheckout}
                       open={showBookReturnDialogue}
                       setOpen={setShowBookReturnDialogue}
                   />
               }
               {checkoutJSX()}
           </>
           : <p className="loading">Loading</p>
}

export default CheckoutDetail