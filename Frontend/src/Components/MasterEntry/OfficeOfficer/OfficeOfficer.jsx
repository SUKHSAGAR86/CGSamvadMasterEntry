import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const OfficeOfficer = () => {
  const initialState = {
    sno: "",
    CountryCode: "",
    StateCode: "",
    designation_sno: "",
    section_code: "",
    employee_code: "",
    base_dept_code: "",
    office_code: "",
    district_code: "",
    user_code: "",
    status: "",
    designation_id: "",
    prarup_code: "",
    head_code: "",
    Commision_Percentage: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [dataList, setDataList] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Load all records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const res = await axios.get("http://localhost:3080/api/officeofficer/get-Officeofficer");
    setDataList(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:3080/api/officeofficer/update-Officeofficer/${formData.sno}`,
          formData
        );
        setAlertMsg("Record updated successfully!");
      } else {
        await axios.post("http://localhost:3080/api/officeofficer/add-Officeofficer", formData);
        setAlertMsg("Record added successfully!");
      }
      setFormData(initialState);
      setIsEditMode(false);
      fetchRecords();
      setTimeout(() => setAlertMsg(""), 800);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditMode(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4 bg-success-subtle p-2 rounded">
        {isEditMode ? "Edit Office Officer" : "Add Office Officer"}
      </h3>

      {alertMsg && (
  <div
    className="position-fixed top-50 start-50 translate-middle p-4 bg-success text-white rounded shadow text-center"
    style={{ zIndex: 9999, minWidth: "300px" }}
  >
    {alertMsg}
  </div>
)}

      <form onSubmit={handleSubmit} className="row g-3 border p-4 mt-4 rounded shadow">
        {[
          ["CountryCode", "Country Code"],
          ["StateCode", "State Code"],
          ["designation_sno", "Designation SNO"],
          ["section_code", "Section Code"],
          ["employee_code", "Employee Code"],
          ["base_dept_code", "Base Dept Code"],
          ["office_code", "Office Code"],
          ["district_code", "District Code"],
          ["user_code", "User Code"],
          ["designation_id", "Designation ID"],
          ["prarup_code", "Prarup Code"],
          ["head_code", "Head Code"],
          ["Commision_Percentage", "Commission %"],
        ].map(([name, label]) => (
          <div className="col-md-4" key={name}>
            <label className="form-label">{label}</label>
            <input
              type={name === "Commision_Percentage" ? "number" : "text"}
              className="form-control"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
             <option value="">--Select Status--</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div className="col-12 text-center mt-5">
          <button type="submit" className="btn btn-primary bi-arrow-up-circle-fill">&nbsp;
            {isEditMode ? "Update" : "Submit"}
          </button>
          {isEditMode ?(
            <button
              type="button"
              className="btn btn-danger bi-x-circle-fill ms-2"
              onClick={() => {
                setFormData(initialState);
                setIsEditMode(false);
              }}
            >&nbsp;
              Cancel
            </button>
          ):(  <button
            type="button"
            className="btn btn-danger bi-x-circle-fill ms-2"
            onClick={() => {
              setFormData(initialState);
            
            }}
          >&nbsp;
            Clear
          </button>)}
        </div>
      </form>

      <hr className="my-4 mt-5" />
      <h4 className="mb-3 mt-3">All Records</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-light text-center">
            <tr>
              <th className="bg-dark text-white fw-bold">SNO</th>
              <th className="bg-dark text-white fw-bold">Employee Code</th>
              <th className="bg-dark text-white fw-bold">Office Code</th>
              <th className="bg-dark text-white fw-bold">Status</th>
              <th className="bg-dark text-white fw-bold">Commission %</th>
              <th className="bg-dark text-white fw-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {dataList.map((item) => (
              <tr key={item.sno}>
                <td>{item.sno}</td>
                <td>{item.employee_code}</td>
                <td>{item.office_code}</td>
                <td><span className={`badge ${item.status==="1"?"bg-success":"bg-secondary"}`}>{item.status === "1" ? "Active" : "Inactive"}</span></td>
                <td>{item.Commision_Percentage}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2 bi-pencil-fill fw-bold"
                    onClick={() => handleEdit(item)}
                  >&nbsp;
                   Edit
                  </button>
                 
                </td>
              </tr>
            ))}
            {dataList.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficeOfficer;
