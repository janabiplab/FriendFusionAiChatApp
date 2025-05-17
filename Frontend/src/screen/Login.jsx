import React ,{useState,useContext} from 'react'
import styled from 'styled-components'
import {Link,useNavigate} from "react-router-dom"
import axios from '../config/axios'
import {UserContext} from "../context/user.context"

function Login() {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    const {setUser}=useContext(UserContext)
    const navigate=useNavigate()

    const handleSubmit=(e)=>{
        e.preventDefault()
        axios.post('/users/login',{
            email,
            password
        }).then((res)=>{
           
            localStorage.setItem('token',res.data.token)
           
            setUser(res.data.user)
            navigate('/')
        }).catch((err)=>{
            console.log(err)
        })
    }
  return (
    <LoginContainer>
        <LoginInner>
            <h3>Login</h3><br/>
            <form onSubmit={handleSubmit} >
                <label>Email</label><br/>
                <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                 required/><br/><br/>
                <label>password</label><br/>
                <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required/><br/><br/>
                <button type="submit">Login</button>
            </form>
            <p>Don`t have an account?<Link to="/register" style={{textDecoration:'none', color:'white',textShadow:'2px 2px 2px black'}}>Create One</Link></p>

        </LoginInner>
    </LoginContainer>
  )
}

export default Login

const LoginInner=styled.div`
input{
    width:100%;
    padding:3px;
    outline:none;
    margin-top:2px;
    background-color:#3a3c3d;
    border-radius:1px;
    border:none;
    color:white;
    
}
button{
    width:100%;
    border:none;
    padding:5px;
    background-color:#297cc9;
    border-radius:3px;
    cursor:pointer;
    color:white;
    font-weight:bold;
    text-shadow:2px 2px 2px black;
    
}
p{
    color:#297cc9;
    margin-top:15px;
    font-size:15px;
    margin-bottom:20px;
}
 h3{
    color:white;
    margin-top:10px;
 };
 label{
    color:#c3cbd3;
    font-size:14px;
 }
 width:300px;
 height:auto;
 background-color:#13283b;   
 border-radius:5px;
 padding:10px;
 box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

`
const LoginContainer=styled.div`
  width:100%;
  height:100vh;
  overflow:hidden;
  background-color:#031220;
  display:flex;
  align-items:center;
  justify-content: center;
    
`