import { ICheckout } from "./checkout";

export interface IBookReturnDialogue {
    checkout: ICheckout
    setCheckout: (state: ICheckout) => void
    open: boolean
    setOpen: (state: boolean) => void
}