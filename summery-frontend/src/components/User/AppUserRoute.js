import React from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Layout from '../Layout';

const AppUserRoute = ({ element: Element, ...rest }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  
  const validpath = ["/appuser", "/appuser/dashboard"]
  const isValidPath = validpath.includes(pathname)
  if(!isValidPath) {
      navigate(-1);
  }
  
  return ( 
    <Routes
    >
     <Route path="/" element={
       <Layout>
         <Element/>
       </Layout>
     }                                                  
     >  
     </Route>
    </Routes>
  )
}

export default AppUserRoute;