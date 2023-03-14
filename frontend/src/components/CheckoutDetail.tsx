import { useEffect, useState } from "react";
import { ICheckout } from "../types/checkout";
import { useLocation } from "react-router-dom";
import { getCheckout } from "../services/checkoutService";

function CheckoutDetail(): JSX.Element {
    const [checkout, setCheckout] = useState<ICheckout>()
    const location = useLocation()
    const checkoutId: string = location.pathname.split("/checkouts/")[1]

    function loadCheckout(checkoutId: string): void {
        getCheckout(checkoutId)
            .then(r => {
                setCheckout(r.data)
            })
    }

    function checkoutJSX(): JSX.Element {
        if (!checkout) return <></>

        const bookReturned: boolean = checkout.returnedDate !== null
        const statusJSX: JSX.Element = bookReturned ? <></> : <button className="checkout__return">Return book</button>

        return (
            <section className="checkout">
                <h4 className="checkout__title">{checkout.borrowedBook.title}</h4>
                <p className="checkout__author">{checkout.borrowedBook.author}</p>
                <p className="checkout__year">{checkout.borrowedBook.year}</p>
                <p className="checkout__firstname">{checkout.borrowerFirstName}</p>
                <p className="checkout__lastname">{checkout.borrowerLastName}</p>
                <p className="checkout__checkedOut">{checkout.checkedOutDate}</p>
                <p className="checkout__dueDate">{checkout.dueDate}</p>
                { statusJSX }
            </section>
        )
    }

    useEffect(() => {
        loadCheckout(checkoutId)
    }, [])

    return (
        <>{ checkoutJSX() }</>
    )
}

export default CheckoutDetail