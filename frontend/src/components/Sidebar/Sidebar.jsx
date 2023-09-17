import React, { useState } from 'react'
import './Sidebar.css'
import SiteLogo from '../../Assets/Images/svg/logo.svg'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Homeimg from '../../Assets/Images/svg/homeactive.svg'
import Homeactive from '../../Assets/Images/svg/home.svg'
import Chart from "../../Assets/Images/svg/chart.svg"
import Chartactive from '../../Assets/Images/svg/activechart.svg'
import User from '../../Assets/Images/svg/user.svg'
import Useractive from '../../Assets/Images/svg/useractive.svg'
import Exit from '../../Assets/Images/svg/exit.svg'
import Strelka from '../../Assets/Images/svg/strelka.svg'

const Sidebar = () => {
  const navigate = useNavigate()
   const [adminka , setAdminka] = useState(false)
   const exitHandle =()=>{
    localStorage.removeItem("token")
    navigate("/")
    window.location.reload()
   }
  return (
    <>
      <div className="sidebar">
        <Link className={"logo-side"} to={'/'} >
             <img src={SiteLogo} alt="logo" />
             <span>Unit AI</span>    
        </Link>
        <NavLink className={"chart"} to={"/"}>
        {({ isActive, isPending }) => (
     isActive ? <><img src={Homeactive} alt="" />  <span>Обзор</span></> :  <><img src={Homeimg} alt="" />  <span>Обзор</span></>     
  )}         
        </NavLink>
        <NavLink to={'/addcamera'} className={"chart"}>
        {({ isActive, isPending }) => (
         isActive ? <><img src={Chartactive} alt="" />  <span>Настройки модели</span></> :  <><img src={Chart} alt="" />  <span>Настройки модели</span></>     
        )}  
  
        </NavLink>
        <NavLink to={'/profile' } className={"chart"}>
        {({ isActive, isPending }) => (
         isActive ? <><img src={Useractive} alt="" />  <span>Профиль</span></> :  <><img src={User} alt="" />  <span>Профиль</span></>     
        )}  
          
        </NavLink>
        {/* <div onClick={()=>setAdminka(!adminka)} className="adminka-sid">
          <img src={User} alt="" />
          <p>Админка</p>
          <img className={adminka ? "" : 'img-rotate'} src={Strelka} alt="" />
        </div>
        {
          adminka && 
            <>
             <NavLink to={'/pozvatol'} className={({ isActive, isPending }) =>
    isPending ? "adminka-sid__inner1" : isActive ? "adminka-sid__inner2" : "adminka-sid__inner"
  } >
          Пользователи
          </NavLink>
          <NavLink to={'/addmodel'}
          className={({ isActive, isPending }) =>
          isPending ? "adminka-sid__inner1" : isActive ? "adminka-sid__inner2" : "adminka-sid__inner"
        }
          >
          Модели
          </NavLink>
            </>
        } */}

         <Link onClick={()=>exitHandle()} className={"exit"}>
            <img src={Exit} alt="" />
            <span>Выход</span>
         </Link>
      </div>
    </>
  )
}

export default Sidebar