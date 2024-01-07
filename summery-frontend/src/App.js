import React, { useContext, useEffect } from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from './context/authContext'
import AdminRoute from './components/Admin/AdminRoute';
import AdminComponent from './components/Admin/AdminComponent';
import AppUserRoute from './components/User/AppUserRoute';
import AppUserComponent from './components/User/AppUserComponent';
import SignIn from './components/Common/SingIn';
import SignUp from './components/Common/SignUp';
import Notfound from './components/Notfound';

const App = () => {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    const navigate = useNavigate()
    const { pathname } = useLocation()

    useEffect(() => {
        if(!isAuthenticated && (pathname === "/" || pathname === "/signin")) {
            navigate("/signin")    
        } 
        else if(isAuthenticated && pathname === "/signin") {
            navigate(-2, { replace: true })
        } 
        else {
            console.log("else-blog", pathname)
            navigate(`${pathname}`)
            
        }
    },[isAuthenticated]) 

    return (
        <>
            <ToastContainer/>
            <Routes>
                <Route path="/admin/*" element={isAuthenticated && userRole === "admin" ? <AdminRoute element={AdminComponent}/> : null}/>
                <Route path="/appuser/*" element={isAuthenticated && userRole === "app-user" ? <AppUserRoute element={AppUserComponent}/> : null}/> 
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                {/* <Route path="/*" element={<Notfound/>}/> */}
            </Routes>
        </>
    )
}

export default App;
