import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from '../Pages/Homepage/Homepage'
import Register from '../Pages/Regiter1/Register'
import Addcamera from '../Pages/Addcamera/Addcamera'
import Profile from '../Pages/Profile/Profile'
// import Addmodel1 from '../Pages/Addmodel/Addmodel'
// import Pozvatol from '../Pages/Pozvatol/Pozvatol'

const Authentication = () => {
  return (
    <Routes>
    <Route element={<Homepage/>} path='/'  >
      <Route index  element={<Register/>} />
      <Route path='/addcamera' element={<Addcamera/>} />
      <Route path='/profile' element={<Profile/>} />
      {/* <Route path='/addmodel' element={<Addmodel1/>} /> */}
      {/* <Route path='/pozvatol' element={<Pozvatol/>} /> */}
    </Route>
  </Routes>
  )
}

export default Authentication