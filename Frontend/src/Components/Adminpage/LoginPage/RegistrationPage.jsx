import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    AdminId: "",
    AdminName: "",
    Password: "",
    Email: "",
    Mobile: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3080/admin-user", formData);
      alert(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center container-fluid " >
      <div className="card "style={{width: "26rem"}}>
      <h2 className=" card-header bg-primary text-light d-flex justify-content-center  "><span className="bi bi-person-lines-fill"></span>&nbsp;Registration</h2>
      <form className="justify-content-center mt-3 p-4" onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Admin ID</label>
          <input type="text" className="form-control" name="AdminId" placeholder="Like- Abcd12@"
          onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Admin Name</label>
          <input type="text" className="form-control" name="UserName"placeholder="Abcd"
           onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="Email"  placeholder="Ex- abcd@1gmail.com"
          onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Mobile</label>
          <input type="text" className="form-control" name="Mobile" placeholder="Contact Number"
          onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" name="Password" placeholder="Enter Your Password"
          onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      </div>
    </div>
  );
};

export default Register;
