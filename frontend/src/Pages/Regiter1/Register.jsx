import React, { useEffect, useState } from 'react'
import Video from '../../Assets/Images/png/video.png'
import http from '../../axios'
const Register = () => {
  const [data , setData] = useState([])
  const [videid , setVideoid] = useState("")
  const [modal ,setModal] = useState(false)
  const [videos , setVideos] = useState([

  ])

   useEffect(()=>{
    getCameraList()
   } , [])
  const getCameraList = ()=>{
    http.get(process.env.REACT_APP_API + "/camera/list/" , ).then((res)=>{
      console.log(res.data)
      setData(res.data.results)
    }).catch((err)=>{
      console.log(err)
      
    })
  }
 
  const handleVideo =(id)=>{      
      setVideos([...videos,id])
    console.log(videos)
  }
  const handleVideo2 =(id)=>{
    const newNumbers = [...videos]; // Arrayni ko'chirish (copy) qilamiz
    const deleted = newNumbers.splice(videos.indexOf(id), 1); // Index bo'yicha elementni o'chiramiz
    setVideos(newNumbers); // Yangi arrayni statega saqlaymiz
  }

  return (
    <div className="outlet">

      {
        data?.map((item , index)=>(
          <div key={index} className="outlet__kameras">
          <h3>{item.title}</h3>
           <div className="outlet__kameras-img">
           {
            videos.includes(item.id) ?      <img onClick={()=>handleVideo2(item.id)} width={942} height={494} src={`http://127.0.0.1:8000/camera/video_feed/${item.id}/`} alt=""  /> :      <img onClick={()=>handleVideo(item.id)} width={942} height={494} src={Video} alt=""  />
           }
         </div>
         </div>
        ))
      }
    

   
  
  </div>
  )
}

export default Register