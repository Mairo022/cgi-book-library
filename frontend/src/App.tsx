import { Route, Routes } from "react-router-dom";
import './styles/App.scss'
import './styles/dialogue.scss'
import Books from "./pages/Books";
import Book from "./pages/Book";
import Checkouts from "./pages/Checkouts";
import Checkout from "./pages/Checkout";
import BooksFavourites from "./pages/BooksFavourites"
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Login from "./pages/Login";

function App() {
    return (
        <div className="App">
            <Header/>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Books/>}/>
                <Route path="/login" element={<Login/>}/>

                <Route path="/books" element={<Books/>}/>
                <Route path="/books/:bookId" element={<Book/>}/>
                <Route path="/books/favourites" element={<BooksFavourites/>}/>

                <Route path="/checkouts" element={<Checkouts/>}/>
                <Route path="/checkouts/:checkoutId" element={<Checkout/>}/>

                <Route path="*" element={<p className="error_loading">Not found</p>}/>
            </Routes>
        </div>
    )
}

export default App