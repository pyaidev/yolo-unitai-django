import React, { useEffect, useState } from 'react'
import Video from '../../Assets/Images/png/video.png'
import http from '../../axios'
const Register = () => {
  const [data , setData] = useState([])
  const [videid , setVideoid] = useState("")
  const [modal ,setModal] = useState(false)

  window.onclick = function(event) {
    if (event.target.id === "myModal") {
       setModal(false)
    }
  }
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
  const getVideo =(id)=>{
   setVideoid(id)
   setModal(true)
  }
  return (
    <div className="outlet">

     {
       modal=== true && 
       <div id="myModal" className="modal">
        <div onClick={()=>setModal(false)} className="closebtn">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="white" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
         </svg>
        </div>
       <div className="modal-content">
        
          <img className='videocam' width={900} height={600}  src={`http://127.0.0.1:8000/camera/video_feed/${videid}/`} />
       </div>
       </div>
     }

      {
        data?.map((item , index)=>(
          <div key={index} className="outlet__kameras">
          <h3>{item.title}</h3>
           <div onClick={()=>getVideo(item.id)} className="outlet__kameras-img">  
           <img src={Video} alt="" />      
         </div>
         </div>
        ))
      }
     

  
    {/* <img width={400} height={400}  src="http://64.226.102.92:8001/camera/video_feed/1/"/> */}
   
  
  </div>
  )
}

export default Register