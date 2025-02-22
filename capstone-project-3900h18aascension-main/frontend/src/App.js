import React, { useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Mainbody from './components/Mainbody';
import Navbar from './components/Navbar';
import Author from './pages/Author';
import Home from './pages/Home';
import Login from './pages/Login';
import Book from './pages/Book';
import Profile from './pages/Profile';
import SearchAuthor from './pages/SearchAuthor';
import SearchBook from './pages/SearchBook';
import Signup from './pages/Signup';
import Footbar from './components/Footbar';
import { AuthContext } from './context';

function App() {
  const {contextIsLogin } = useContext(AuthContext);
  console.log(`App: ${contextIsLogin}`);

  return (
    <>
      <Navbar/>
      <Mainbody>
        <Routes>
          {/* login and signup */}
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/signup" element={<Signup/>}/>

          {/* view everyone's profile, collection, and all reviews */}
          <Route exact path="/profile/:userId" element={<Profile/>}/>

          {/* search for movie and author */}
          <Route exact path="/search/book" element={<SearchBook/>}/>
          <Route exact path="/search/author" element={<SearchAuthor/>}/>

          {/* movie detail and author detail */}
          <Route exact path="/book/:bookId" element={<Book/>}/>
          <Route exact path="/author/:authorId" element={<Author/>}/>

          {/* root page */}
          <Route exact path="/" element={<Home/>}/>

          {/* match 404 */}
          <Route path="*" element={<div>404</div>}/>
        </Routes>
      </Mainbody>
      <Footbar/>
    </>
  );
}

export default App;
