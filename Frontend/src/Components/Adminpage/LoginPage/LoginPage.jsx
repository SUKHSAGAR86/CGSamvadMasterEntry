import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";


const LoginPage = () => {
  // const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({ AdminId: "", Password: "" });
const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/" />; 
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3080/api/auth/login-admin", formData);
      // console.log(res.data)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.admin));
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center ">
      <div className="card mt-3" style={{width:"25rem"}}>
      <h2 className="d-flex justify-content-center bg-dark-subtle p-2 "><span className="bi bi-person-circle"></span>&nbsp;Login</h2>
      <form className="p-3" onSubmit={handleLogin} >
        <div className="mb-3">
          <label>AdminId</label>
          <input type="text" className="form-control" name="AdminId" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" name="Password" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Login</button>
       
      </form>
      </div>
    </div>
  );
};

export default LoginPage;
