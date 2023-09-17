import React, { useEffect, useState } from 'react'
import Action from '../../Assets/Images/svg/action.svg'
import redac from '../../Assets/Images/svg/redac.svg'
import Delet from '../../Assets/Images/svg/delet.svg'
import './Addcamera.css'
import http from '../../axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addcamera = () => {
  const notify = (text) => toast(`${text}`);
    const [tableaction , setTableaction] = useState('')
    const [edit , setEdit] = useState(false)
    const [data ,setData] = useState([])
    const [addres , setAddres] = useState('')
    const [kamera , setKamera] = useState('')
    const [model , setModel] = useState('')
    const [idcam , setIdCam] = useState('')
    const [tokenBot , setTokenBot] = useState('')
    const [idchat , setIdchat] = useState('')
    const [shablon , setShablon] = useState("")
    const [refresh , setRefresh] = useState(false)
    const [modelar , setModelar] = useState([])
    const [editid , setEditid] = useState('')

    useEffect(()=>{
      getCameraList()
    } , [refresh])
    useEffect(()=>{
     getModel()
    }, [])
    const handeleTable =(id)=>{
        if(id===tableaction){
            setTableaction("")
        }else{
            setTableaction(id)
        }
    }
    const getCameraList = ()=>{
        http.get("/camera/list/" , ).then((res)=>{
          setData(res.data.results)
        }).catch((err)=>{
          console.log(err)
        })
      }
      const getModel =()=>{
        http.get(process.env.REACT_APP_API + "/camera/model/" ).then((res)=>{
            setModelar(res.data.results)
          }).catch((err)=>{
            console.log(err)
          })
      }

    

    const handleClick =(e)=>{
        e.preventDefault()
        edit ?
       http.put(`/camera/update/${editid}/` , {
        address: addres,
        title: kamera,
        object_id: idcam,
        chat_id: idchat ,
        toke_bot:tokenBot,
        shablon_sobsheniya:shablon,
        model:model-0,       
       }).then((res)=>{
       if(res.status===200){
        window.location.reload()
       }
       }).catch((err)=>{
        console.log(err)
        notify(`В введенной вами информации есть ошибка !`)
       })
       :
       http.post("/camera/create/" , {
        address: addres,
        title: kamera,
        object_id: idcam,
        chat_id: idchat ,
        toke_bot:tokenBot,
        shablon_sobsheniya:shablon,
        model:model-0,       
       }).then((res)=>{
       if(res.status===201){
        window.location.reload()
       }
       }).catch((err)=>{
        console.log(err)
        notify(`В введенной вами информации есть ошибка !`)
       })
    }
    const handleDelet =(id)=>{
      http.delete(`/camera/delete/${id}/`).then((res)=>{
        if(res.status===204){
            setRefresh(!refresh)
        }
      }).catch((err)=>{
        console.log(err)
        notify(`Что-то не так!`)
      })
    }
    const handleEdit =(item)=>{
        setEdit(true)
        setAddres(item.address)
        setKamera(item.title)
        setModel(item.model)
        setIdCam(item.object_id)
        setTokenBot(item.toke_bot)
        setIdchat(item.chat_id)
        setShablon(item.shablon_sobsheniya)
        setEditid(item.id)
    }
  return (
    <div className="outlet">
          <ToastContainer
              autoClose={1500}              
       />
         <section id='edit' className="addcamera">
            <form  className="addcamera__form" action="">
                <h2>{edit ? "Изменить камеру" : "Добавить камеру"} </h2>
                <label>
                    <p>Адрес RTSP</p>
                    <input defaultValue={addres} onChange={(e) =>setAddres(e.target.value)} type="text" placeholder="Адрес RTSP"/>
                    
                </label>
                <label>
                    <p>Название камеры</p>
                    <input defaultValue={kamera} onChange={(e) =>setKamera(e.target.value)} type="text" placeholder='Камера №1' />
                </label>
                <label>
                    <p>Модель</p>
                    <select defaultValue={model} onChange={(e) =>setModel(e.target.value)}  id="">
                        <option selected hidden >Dropdown-list</option>
                        { 
                        modelar?.map((item , index) =>(
                            <option  key={index} value={item.id}>{item.title}</option>
                        ))
                        }
                    </select>
                </label>
                <label>
                    <p>ID для отслеживания</p>
                    <input defaultValue={idcam} onChange={(e) =>setIdCam(e.target.value)} type="text" placeholder="0, 3, 7"/>
                </label>
                <label>
                    <p>Токен бота ТГ</p>
                    <input defaultValue={tokenBot} onChange={(e) =>setTokenBot(e.target.value)} type="text" placeholder="asfasfdsa:265165165165"/>
                </label>
                <label>
                    <p>ID чата ТГ</p>
                    <input defaultValue={idchat} onChange={(e) =>setIdchat(e.target.value)} type="text" placeholder="123456789"/>
                </label>
                <label>
                    <p>Шаблон сообщения</p>
                    <input defaultValue={shablon} onChange={(e) =>setShablon(e.target.value)} type="text" placeholder="Какой-то текст сообщения...."/>
                </label>
                <button onClick={(e)=>handleClick(e)}>
                 Сохранить                 
                </button>
            </form>
         </section>
         <div className='addcameratable' >
         <table class=" table table-striped">
  <thead>
    <tr>
               <th>Название</th>
                        <th>Адрес</th>
                        <th>Модель</th>
                        <th>ID для отслеж-я</th>
                        <th>Токен бота ТГ</th>
                        <th>ID чата ТГ</th>
                        <th>Шаблон сообщения</th>
                        
                        <th className="table-action"></th>
    </tr>
  </thead>
  <tbody>
    {
        data?.map((item , index)=>(
            <tr key={index}>
               <td>{item.title}</td>
                            <td>{item.address.slice(0,15)}...</td>
                            <td>{item.model}</td>
                            <td>{item.object_id}</td>
                            <td>{item.toke_bot.slice(0,15)}...</td>
                            <td>{item.chat_id.slice(0,15)}...</td>
                            <td>{item.shablon_sobsheniya.slice(0,15)}...</td>
                            <td onClick={()=>handeleTable(item.id)} id="actionicon1" className="tbody-action">
                               <img  src={Action} alt="" />
                                <div  id="actionicon1wrap" className={tableaction=== item.id ? "tbody-action__wrap actioniconwrap" : "tbody-action__wrap "}>
                                    <a href='#edit' onClick={()=>handleEdit(item)} id="redac" className="actionwrapinner">
                                         <img src={redac} alt="" />
                                        <p>Редактировать</p>
                                    </a>
                                    <div onClick={()=>handleDelet(item.id)} id="delet" className="actionwrapinner">
                                          <img src={Delet} alt="" />
                                        <p>Удалить</p>
                                    </div>
                                </div>
                            </td>

            </tr>
        ))
    }
  </tbody>
 
</table>
         </div>
      </div>
  )
}

export default Addcamera