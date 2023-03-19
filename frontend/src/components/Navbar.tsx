import { NavLink, useNavigate } from "react-router-dom";
import "../styles/components/navbar.scss"
import { useUserDetails } from "../context/userContext";

function Navbar(): JSX.Element {
    const {role, setRole, setIsLoggedIn} = useUserDetails()
    const navigate = useNavigate()

    function logOut(): void {
        setRole(undefined)
        setIsLoggedIn(false)
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("role")
    }

    function logIn(): void {
        navigate("/login")
    }

    function navbar(): JSX.Element {
        if (role === "reader") {
            return (
                <nav className="nav">
                    <NavLink className="nav__item" to="/books">Books</NavLink>
                    <NavLink className="nav__item" to="/books/favourites">My Books</NavLink>
                    <button className="nav__item nav__btn" onClick={() => {logOut()}}>Logout</button>
                </nav>
            )
        }
        if (role === "librarian") {
            return (
                <nav className="nav">
                    <NavLink className="nav__item" to="/books">Books</NavLink>
                    <NavLink className="nav__item" to="/checkouts">Checkouts</NavLink>
                    <button className="nav__item nav__btn" onClick={() => {logOut()}}>Logout</button>
                </nav>
            )
        }

        return (
            <nav className="nav">
                <NavLink className="nav__item" to="/books">Books</NavLink>
                <button className="nav__item nav__btn" onClick={() => {logIn()}}>Login</button>
            </nav>
        )
    }

    return navbar()
}

export default Navbar