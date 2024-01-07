import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import MainAppBar from './Common/AppBar'

const Layout = ({ children }) => {
  const { userRole } = useContext(AuthContext)

  return (
    <div>
        <MainAppBar/>  
        {children}
        <Outlet/>
    </div>
  )
}

export default Layout