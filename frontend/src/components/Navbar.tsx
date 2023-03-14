import { NavLink } from "react-router-dom";
import "../styles/components/navbar.scss"

function Navbar(): JSX.Element {
    return (
        <nav className="nav">
            <NavLink className="nav__item" to="/books">Books</NavLink>
            <NavLink className="nav__item" to="/checkouts">Checkouts</NavLink>
            <button type="button">Login</button>
        </nav>
    )
}

export default Navbar