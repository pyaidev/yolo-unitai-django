import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../Pages/Login/Login'
const UnAuthentication = () => {
  return (
    <div>
        <Routes>
            <Route index path={'/'} element={<Login/>}/>
        </Routes>
    </div>
  )
}

export default UnAuthentication