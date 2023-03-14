import { IBook } from "./book";

export interface ICheckout {
    borrowedBook: IBook
    borrowerFirstName: string
    borrowerLastName: string
    checkedOutDate: string
    returnedDate: string | null
    dueDate: string
    id: string
}