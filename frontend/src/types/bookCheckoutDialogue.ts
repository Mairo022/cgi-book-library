import { IBook } from "./book";

export interface IBookCheckoutDialogue {
    book: IBook
    open: boolean
    setOpen: (state: boolean) => void
}

export interface IUserData {
    firstname: string,
    lastname: string
}