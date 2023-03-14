import { Route, Routes } from "react-router-dom";
import './styles/App.css'
import Books from "./pages/Books";
import Book from "./pages/Book";
import Checkouts from "./pages/Checkouts";
import Checkout from "./pages/Checkout";
import BooksFavourites from "./pages/BooksFavourites"
import CheckoutsPersonal from "./pages/CheckoutsPersonal";
import Navbar from "./components/Navbar";
import Header from "./components/Header";

function App() {
    return (
        <div className="App">
            <Header/>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Books/>}/>

                <Route path="/books" element={<Books/>}/>
                <Route path="/books/:bookId" element={<Book/>}/>
                <Route path="/books/favourites" element={<BooksFavourites/>}/>

                <Route path="/checkouts" element={<Checkouts/>}/>
                <Route path="/checkouts/:checkoutId" element={<Checkout/>}/>
                <Route path="/checkouts/my-checkouts" element={<CheckoutsPersonal/>}/>

                <Route path="*" element={<p>Not found</p>}/>
            </Routes>
        </div>
    )
}

export default App