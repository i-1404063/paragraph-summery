import React, { createContext, useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  
  useEffect(() => {
      const token = JSON.parse(localStorage.getItem("auth"));
      if(token) {
        const decoded = jwt_decode(token);
        setIsAuthenticated(true);
        setUserRole(decoded.role);
        setUsername(decoded.username);
      }
  },[])

  const login = (role, username, token) => {
      localStorage.setItem("auth", JSON.stringify(token))
      setIsAuthenticated(true);
      setUserRole(role);
      setUsername(username);
  }

  const logout = () => {
     localStorage.removeItem("auth");
     setIsAuthenticated(false);
     setUserRole("");
     setUsername("");
  }

  const returnValue = {
    isAuthenticated,
    userRole,
    username,
    login,
    logout
  }

  return (
     <AuthContext.Provider value={returnValue}>
        {children}
     </AuthContext.Provider>
  )
}

export default AuthContextProvider;