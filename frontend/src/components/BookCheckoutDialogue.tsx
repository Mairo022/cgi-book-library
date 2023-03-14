import { ICheckout } from "../types/checkout";
import { saveCheckout } from "../services/checkoutService";
import {v4 as uuidv4} from 'uuid';

function BookCheckoutDialogue(props: any): JSX.Element {
    const {book} = props

    function checkout(): void {
        if (!book) return

        const userData: ICheckout = {
            borrowedBook: book,
            borrowerFirstName: "James",
            borrowerLastName: "Chirk",
            checkedOutDate: "2020-09-01",
            dueDate: "2024-09-01",
            returnedDate: null,
            id: uuidv4()
        }
        saveCheckout(userData)
            .then(r => console.log(r))
    }
    return (
        <div className="dialogue">
            <button onClick={() => { checkout() }}>Checkout</button>
        </div>
    )
}

export default BookCheckoutDialogue