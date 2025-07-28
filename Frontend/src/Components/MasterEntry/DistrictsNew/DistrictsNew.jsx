import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const DistrictsNew = () => {
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState(initialForm());
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ipAddress, setIpAddress] = useState("127.0.0.1");

  // Alert box states
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchDistricts();
    fetchIPAddress();
  }, []);

  function initialForm() {
    return {
      District_ID: "",
      District_Name: "",
      District_Name_En: "",
      Division_id: "",
      Division_name_Hindi: "",
      Division_name_English: "",
      CountryCode: "",
      StateCode: "",
      flag: 1,
      DisplayOrder: 1,
      ip_address: "",
    };
  }

  const fetchIPAddress = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setIpAddress(data.ip);
    } catch (err) {
      console.error("Failed to fetch IP address", err);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/districtnew/get-districtnew");
      const districtArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setDistricts(districtArray);
    } catch (err) {
      console.error(err);
      setAlertMessage("Failed to fetch districts");
      setShowAlert(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (district = null) => {
    if (district) {
      setFormData({ ...district, ip_address: ipAddress });
      setIsEditing(true);
    } else {
      setFormData({ ...initialForm(), ip_address: ipAddress });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:3080/api/districtnew/update-districtnew/${formData.District_ID}`,
          {
            ...formData,
            modify_ip_address: ipAddress,
          }
        );
        setAlertMessage("Updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/districtnew/add-districtnew", {
          ...formData,
          ip_address: ipAddress,
        });
        setAlertMessage("Added successfully");
      }
      setShowAlert(true);
      setShowModal(false);
      fetchDistricts();
    } catch (err) {
      setAlertMessage("Error: " + (err.response?.data || err.message));
      setShowAlert(true);
    }
  };

  // Custom alert box component
  const AlertBox = ({ message, onClose }) => {
    return (
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1055,
        }}
      >
        <div className="bg-success-subtle fs-4 fw-bold"
          style={{
            backgroundColor: "#fff",
            padding: "20px 30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            maxWidth: "400px",
            textAlign: "center",
            fontSize: "18px",
            color: "#333",
          }}
        >
          <p>{message}</p>
          <button
            className="btn btn-primary"
            onClick={onClose}
            style={{ marginTop: "15px" }}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 bg-primary-subtle p-2">All Districts</h2>
      <p className="text-end text-muted">Your IP: {ipAddress}</p>

      <button className="btn btn-primary mb-3 bi-plus-circle-fill" onClick={() => openModal()}>
        &nbsp;Add New District
      </button>

      <div className="table-responsive text-center">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>District ID</th>
              <th>District Name Hindi</th>
              <th>District Name English</th>
              <th>Division ID</th>
              <th>Division Name Hindi</th>
              <th>Division Name English</th>
              <th>Country</th>
              <th>State</th>
              <th>Flag</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(districts) && districts.length > 0 ? (
              districts.map((dist) => (
                <tr key={dist.District_ID}>
                  <td>{dist.District_ID}</td>
                  <td>{dist.District_Name}</td>
                  <td>{dist.District_Name_En}</td>
                  <td>{dist.Division_id}</td>
                  <td>{dist.Division_name_Hindi}</td>
                  <td>{dist.Division_name_English}</td>
                  <td>{dist.CountryCode}</td>
                  <td>{dist.StateCode}</td>
                  <td>{dist.flag}</td>
                  <td>{dist.DisplayOrder}</td>
                  <td>
                    <button
                      className="bi bi-pen-fill btn btn-sm btn-warning"
                      onClick={() => openModal(dist)}
                    >&nbsp;
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Edit" : "Add"} District
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body row g-3">
                  {[
                    ["District_ID", "District ID", "text", true],
                    ["District_Name", "District Name (Hindi)", "text"],
                    ["District_Name_En", "District Name (English)", "text"],
                    ["Division_id", "Division ID", "number"],
                    ["Division_name_Hindi", "Division Name (Hindi)", "text"],
                    ["Division_name_English", "Division Name (English)", "text"],
                    ["CountryCode", "Country Code", "text"],
                    ["StateCode", "State Code", "text"],
                    ["flag", "Flag", "number"],
                    ["DisplayOrder", "Display Order", "number"],
                  ].map(([name, label, type, disabled = false]) => (
                    <div key={name} className="col-md-6">
                      <label className="form-label">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-control"
                        disabled={isEditing && disabled}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Box */}
      {showAlert && (
        <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </div>
  );
};

export default DistrictsNew;
