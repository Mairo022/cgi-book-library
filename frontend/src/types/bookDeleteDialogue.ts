import { IBook } from "./book";

export interface IBookDeleteDialogue {
    open: boolean
    setOpen: (state: boolean) => void
    book: IBook
}