import React from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Layout from '../Layout';
import CreateUser from './CreateUser';
import CreateParagraph from './CreateParagraph';
import SummeryView from './SummeryView';

const AdminRoute = ({ element: Element }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  
  const validpath = ["/admin", "/admin/create-user", "/admin/create-paragraph", "/admin/summery-view"]
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
        <Route path="summery-view" element={<SummeryView/>}/>
        <Route path="create-user" element={<CreateUser/>} />
        <Route path="create-paragraph" element={<CreateParagraph/>} />
     </Route>     
    </Routes>
  )
}

export default AdminRoute;