import React, { useState } from 'react'
import './Login.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import http from '../../axios'
const Login = () => {
  const [login , setLogin ] = useState('')
  const [password , setPassword] = useState('')
  const notify = (text) => toast(`${text}`);
  const handleClick =(e)=>{
    e.preventDefault()
    http.post( "/partner/login/" , {
      email_or_username: login,
      password: password
    }).then((res)=>{
        if(res.status === 200){
          localStorage.setItem("token" , res.data.tokens.access)
          localStorage.setItem("id" , res.data.id)
          window.location.reload()
          console.log(res)
        }
    }).catch((err)=>{
      console.log(err.response)
      notify(`Вы ввели неправильный адрес электронной почты или пароль`)
    })
  }
  return (
    <>
       <section className="login">
       <ToastContainer
              autoClose={1500}              
       />
        <div className="login-wrap">
          <form action="" className="login__form">
            <h2>Вход</h2>
             <input onChange={(e)=>setLogin(e.target.value)}  type="email" placeholder='Логин' />
             <input  onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Пароль' />
             <button onClick={(e)=>handleClick(e)}>Войти</button>
          </form>
        </div>
       </section>
    </>
  )
}

export default Login
