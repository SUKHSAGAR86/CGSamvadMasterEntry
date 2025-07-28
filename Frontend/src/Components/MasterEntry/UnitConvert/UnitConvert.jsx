import React, { useEffect, useState } from "react";



const UnitConvert = () => {
  const [conversions, setConversions] = useState([]);
  const [form, setForm] = useState({
    from_unit_cd: "",
    to_unit_cd: "",
    operation: "",
    value: "",
  });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Fetch all conversions on mount
  useEffect(() => {
    fetchConversions();
  }, []);

  const fetchConversions = async () => {
    try {
      const res = await fetch("http://localhost:3080/api/unitconvert/get-unitconvert");
      const data = await res.json();
      setConversions(data);
    } catch (error) {
      showAlert("Failed to fetch conversions", "danger");
    }
  };

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 1000);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    const { from_unit_cd, to_unit_cd, operation, value } = form;
    if (!from_unit_cd.trim()) {
      showAlert("From Unit Code is required", "danger");
      return false;
    }
    if (!to_unit_cd.trim()) {
      showAlert("To Unit Code is required", "danger");
      return false;
    }
    if (!["*", "/", "+", "-"].includes(operation)) {
      showAlert("Operation must be one of *, /, +, -", "danger");
      return false;
    }
    if (isNaN(value) || value === "") {
      showAlert("Value must be a valid number", "danger");
      return false;
    }
    return true;
  };

  // Submit new conversion
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:3080/api/unitconvert/add-unitconvert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_unit_cd: form.from_unit_cd,
          to_unit_cd: form.to_unit_cd,
          operation: form.operation,
          value: parseFloat(form.value),
        }),
      });

      if (res.ok) {
        showAlert("Conversion inserted successfully");
        setForm({ from_unit_cd: "", to_unit_cd: "", operation: "", value: "" });
        fetchConversions();
      } else {
        const errorText = await res.text();
        showAlert(errorText || "Failed to insert conversion", "danger");
      }
    } catch (error) {
      showAlert("Error: " + error.message, "danger");
    }
  };

  // Update conversion
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(`"http://localhost:3080/api/unitconvert/update-unitconvert"/${form.from_unit_cd}/${form.to_unit_cd}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: form.operation,
          value: parseFloat(form.value),
        }),
      });

      if (res.ok) {
        showAlert("Conversion updated successfully");
        setForm({ from_unit_cd: "", to_unit_cd: "", operation: "", value: "" });
        setIsUpdateMode(false);
        fetchConversions();
      } else {
        const errorText = await res.text();
        showAlert(errorText || "Failed to update conversion", "danger");
      }
    } catch (error) {
      showAlert("Error: " + error.message, "danger");
    }
  };

  // Fill form for update
  const handleEdit = (conversion) => {
    setForm({
      from_unit_cd: conversion.from_unit_cd,
      to_unit_cd: conversion.to_unit_cd,
      operation: conversion.operation,
      value: conversion.value,
    });
    setIsUpdateMode(true);
  };

  // Cancel update mode
  const cancelUpdate = () => {
    setForm({ from_unit_cd: "", to_unit_cd: "", operation: "", value: "" });
    setIsUpdateMode(false);
  };

  return (
    <div className="container my-4 align-items-center">
      <h2 className="mb-4 text-center bg-success-subtle p-2 rounded">Unit Convert</h2>

      {/* Alert Box */}
      {alert.message && (
        <div
          className={`alert alert-${alert.type} position-fixed top-50 start-50 translate-middle text-center w-50`}
          style={{ zIndex: 1050 }}
          role="alert"
        >
          {alert.message}
        </div>
      )}

      {/* Form */}
     <div className="container-fluid d-flex justify-content-center">
       
        <form
        className="border p-4 rounded shadow-sm w-75"
        onSubmit={isUpdateMode ? handleUpdate : handleSubmit}
      >
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="from_unit_cd" className="form-label">
              From Unit Code
            </label>
            <input
              type="text"
              className="form-control"
              id="from_unit_cd"
              name="from_unit_cd"
              value={form.from_unit_cd}
              onChange={handleChange}
              disabled={isUpdateMode} // prevent changing from_unit_cd on update
              maxLength={10}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="to_unit_cd" className="form-label">
              To Unit Code
            </label>
            <input
              type="text"
              className="form-control"
              id="to_unit_cd"
              name="to_unit_cd"
              value={form.to_unit_cd}
              onChange={handleChange}
              disabled={isUpdateMode} // prevent changing to_unit_cd on update
              maxLength={10}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="operation" className="form-label">
              Operation (*, /, +, -)
            </label>
            <input
              type="text"
              className="form-control"
              id="operation"
              name="operation"
              value={form.operation}
              onChange={handleChange}
              maxLength={1}
              placeholder="* / + -"
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="value" className="form-label">
              Value
            </label>
            <input
              type="number"
              className="form-control"
              id="value"
              name="value"
              value={form.value}
              onChange={handleChange}
              step="any"
            />
          </div>
        </div>
        <div className="mt-4 text-center">
            <button type="submit" className="btn btn-primary me-2 bi-check-circle-fill fw-bold">&nbsp;
                {isUpdateMode?"Update":"Submit"}    
            </button> 
         
            {!isUpdateMode &&(
                   <button type="button" className="btn btn-outline-danger me-2 bi-eraser-fill fw-bold" onClick={()=>{
                    setForm({from_unit_cd:"",to_unit_cd:"",operation:"",value:""})
                    setIsUpdateMode(false)
                }}>&nbsp;
                    Clear
                </button>
            )}

            {isUpdateMode &&(

                <button type="button" className="btn btn-danger bi-x-circle-fill fw-bold" onClick={cancelUpdate}>&nbsp;
                    Cnacel
                </button>
            )}

        </div>
      </form>
       
     </div>
      <hr />
      {/* Conversion Table */}
        <div className="container-fluid d-flex justify-content-center">
        <div className="table-responsive mt-5 w-75 shadow-sm rounded">
        <table className="table table-striped table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>From Unit Code</th>
              <th>To Unit Code</th>
              <th>Operation</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversions.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No conversions found
                </td>
              </tr>
            )}
            {conversions.map((conv) => (
              <tr key={`${conv.from_unit_cd}_${conv.to_unit_cd}`}>
                <td>{conv.from_unit_cd}</td>
                <td>{conv.to_unit_cd}</td>
                <td>{conv.operation}</td>
                <td>{conv.value}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning bi-pen-fill fw-bold"
                    onClick={() => handleEdit(conv)}
                  >&nbsp;
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
    </div>
  );
};

export default UnitConvert;
