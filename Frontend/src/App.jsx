import { useState } from 'react'
import Login from './screen/Login'
import  { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from './Files/Home'
import { createGlobalStyle } from 'styled-components'
import Register from './screen/Register'
import UserProvider  from "./context/user.context.jsx"
import Project from './screen/Project.jsx'
import UserAuth from './Auth/UserAuth.jsx'


function App() {
  

  return (
    <>
    <GlobalStyle/>
    <UserProvider>
    <Router>
    
      <Routes>
        <Route path="/" element={<UserAuth> <Home/> </UserAuth>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/project" element={<UserAuth> <Project/> </UserAuth>}/>
      </Routes>
    </Router>
    </UserProvider>
      
    </>
  )
}

export default App
const GlobalStyle=createGlobalStyle`
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #f5f5f5;
  }
`
