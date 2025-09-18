import React from "react";
import ContactApp from "./components/ContactApp";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./components/Loginpage/Login";
import RegisterPage from "./components/Registerpage/RegisterPage";
import Protected from "./components/ProtectedRoute/Protected";
function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/" element={<Protected> <ContactApp/> </Protected>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
