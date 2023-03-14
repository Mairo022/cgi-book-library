export interface IUserContext {
    isLoggedIn: boolean
    setIsLoggedIn: (state: boolean) => void
    role: IRole
    setRole: (state: IRole) => void
    firstname: string
    lastname: string
}

export type IRole = "reader" | "librarian" | undefined

export interface IUserProvider {
    children: JSX.Element | JSX.Element[]
}