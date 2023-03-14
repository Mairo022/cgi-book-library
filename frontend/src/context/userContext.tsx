import { createContext, useContext } from "react";
import { IUserContext, IUserProvider } from "../types/contextTypes";

const userContext = createContext<IUserContext | undefined>(undefined)

function UserProvider({children}: IUserProvider): JSX.Element {
    return (
        <userContext.Provider value={{}}>
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