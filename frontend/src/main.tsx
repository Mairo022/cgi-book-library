import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/Index.scss'
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <App/>
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>
)