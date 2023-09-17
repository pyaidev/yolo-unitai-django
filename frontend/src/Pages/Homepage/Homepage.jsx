import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
const Homepage = () => {
  return (
    <div>
        <Sidebar/>
        <Outlet/>
    </div>
  )
}

export default Homepage