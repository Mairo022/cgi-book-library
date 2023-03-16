import { createContext, useContext, useEffect, useState } from "react";
import { IFavouriteBooks, IRole, IUserContext, IUserProvider } from "../types/contextTypes";

const userContext = createContext<IUserContext | undefined>(undefined)

function UserProvider({children}: IUserProvider): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("isLoggedIn"))
    const [role, setRole] = useState<IRole>(undefined)
    const firstname = "Marlon"
    const lastname = "Maxwell"

    const [favouriteBooks, setFavouriteBooks] = useState<IFavouriteBooks>([])

    const exported: IUserContext = {
        isLoggedIn,
        setIsLoggedIn,
        role,
        setRole,
        firstname,
        lastname,
        favouriteBooks,
        setFavouriteBooks
    }

    useEffect(() => {
        const favourites = localStorage.getItem("favourites")
        const role = localStorage.getItem("role")

        if (role === "reader" || role === "librarian") {
            setRole(role)
        }

        if (favourites) {
            setFavouriteBooks(JSON.parse(favourites))
        }
    }, [])

    return (
        <userContext.Provider value={exported}>
            {children}
        </userContext.Provider>
    )
}

function useUserDetails(): IUserContext {
    const context = useContext(userContext)

    if (!context) {
        throw new Error("viewContext is undefined")
    }

    return context
}

export {
    UserProvider,
    useUserDetails
}