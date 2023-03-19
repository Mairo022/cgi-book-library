import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../context/userContext";
import { IRole } from "../types/contextTypes";
import "../styles/pages/login.scss"

function Login(): JSX.Element {
    const navigate = useNavigate()
    const {setRole, setIsLoggedIn} = useUserDetails()

    function onLogin(role: string): void {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("role", role)

        setRole(role as IRole)
        setIsLoggedIn(true)

        navigate("/")
    }

    return (
        <div className="login">
            <button className="login__reader" onClick={() => {onLogin("reader")}}>Login as reader</button>
            <button className="login__librarian" onClick={() => {onLogin("librarian")}}>Login as librarian</button>
        </div>
    )
}

export default Login