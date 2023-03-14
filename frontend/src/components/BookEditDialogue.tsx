import { useEffect } from "react";
import { IBookEditDialogue } from "../types/book";

function bookEditDialogue(props: IBookEditDialogue): JSX.Element {
    const showComponent = props.setShowEditDialogue

    function handleSubmit(e: any) {
        console.log(e)
    }

    function handleOutsideClick(e: MouseEvent): void {
        const el = e.target as Element

        if (!el.className.includes("book_edit")) {
            showComponent(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, true)

        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [])

    return (
        <div className="book_edit">
            <h4 className="book_edit__header">Book status</h4>
            <form className="book_edit__form" onSubmit={handleSubmit}>
                <select className="book_edit__form__select">
                    <option className="book_edit__option" value="available">Available</option>
                    <option className="book_edit__option" value="borrowed" selected>Borrowed</option>
                </select>
                <button className="book_edit__button" type="submit">Save</button>
                <button className="book_edit__button" type="button">Cancel</button>
            </form>
        </div>
    )
}