
import React, { useState } from 'react'
import http from '../../axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const id = localStorage.getItem("id")

const Profile = () => {
    const [login , setLogin] = useState('')
    const [romashka , setRomashka] = useState('')
    const [phone , setPhone] = useState('')
    const [fio , setFio] = useState("")
    const notify = (text) => toast(`${text}`);


    const handelClick =(e)=>{
        e.preventDefault()
       http.put(`/partner/update/${id}/` , {
        email: login,
        company_name: romashka,
        phone_number: phone,
        first_name: fio
       }).then((res)=>{
         if(res.status ===200){
            notify('Информация в профиле обновлена !')
            window.location.reload()
         }
       }).catch((err)=>{
        console.log(err)
        notify(`В введенной вами информации есть ошибка !`)
       })
       
    }
  return (
    <div className="outlet">
            <ToastContainer
              autoClose={1500}              
       />   
    <div className="addcamera">
       <form className="addcamera__form" action="">
           <h2>Настройки профиля</h2>
           <label>
               <p>Логин</p>
               <input onChange={(e)=>setLogin(e.target.value)}  type="email" placeholder="Login"/>
           </label>
          
           <label>
               <p>Компания</p>
               <input onChange={(e)=>setRomashka(e.target.value)} type="text" placeholder="ООО “Ромашка”"/>
           </label>
           <label>
               <p>Телефон</p>
               <input onChange={(e)=>setPhone(e.target.value)} type="text" placeholder="+7 987 654 3211"/>
           </label>
           <label>
               <p>ФИО</p>
               <input onChange={(e)=>setFio(e.target.value)} type="text" placeholder="Иванов Иван Иванович"/>
           </label>
          
         
           <button onClick={(e)=>handelClick(e)}>
               Сохранить
           </button>
       </form>
    </div>

 </div>
  )
}

export default Profile