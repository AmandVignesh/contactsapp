import React from 'react'
import Cookies from "js-cookie"
import { Navigate } from 'react-router'

function Protected({children}) {
    const JwtToken = Cookies.get("jwt_token")
   if (JwtToken === undefined){
        return <Navigate to="/login"/>
   }
   return children
}

export default Protected
