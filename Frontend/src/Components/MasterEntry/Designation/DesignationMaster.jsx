import React, { useState, useEffect } from "react";
import axios from "axios";

const DesignationMaster = () => {
  const [activeTab, setActiveTab] = useState("entry");
  const [designationNameE, setDesignationNameE] = useState("");
  const [designationNameH, setDesignationNameH] = useState("");
  const [status, setStatus] = useState("Active");
  const [orderNo, setOrderNo] = useState("1");
  const [designations, setDesignations] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    const res = await axios.get("http://localhost:3080/api/designation/get-designation");
    setDesignations(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      designation_level_id: "01",
      status: status === "Active" ? 1 : 0,
      order_no: parseInt(orderNo),
      designation_name_E: designationNameE,
      designation_name_H: designationNameH,
      ip_address: "127.0.0.1",
      modify_ip_address: "127.0.0.1",
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3080/api/designation/update-designation/${editId}`,
          data
        );
        alert("Designation updated successfully!");
      } else {
        await axios.post("http://localhost:3080/api/designation/add-designation", data);
        alert("Designation submitted successfully!");
      }
      setDesignationNameE("");
      setDesignationNameH("");
      setStatus("Active");
      setOrderNo("1");
      setEditId(null);
      fetchDesignations();
    } catch (error) {
      alert("Error occurred while saving data!");
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.designation_cd);
    setDesignationNameE(item.designation_name_E);
    setDesignationNameH(item.designation_name_H);
    setStatus(item.status === 1 ? "Active" : "Inactive");
    setOrderNo(item.order_no.toString());
    setActiveTab("entry");
  };

  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <div
        className="border border-2 rounded"
        style={{ width: "100%", maxWidth: "850px", borderColor: "#00AEEF" }}
      >
        <div className="bg-primary text-white fw-bold text-center py-2">
          Departement Designation
        </div>

        {/* Tabs */}
        <div
          className="d-flex border-bottom border-2"
          style={{ borderColor: "#ccc" }}
        >
          <div
            className={`p-2 border-end border-2 flex-grow-1 text-center ${
              activeTab === "entry" ? "bg-info fw-bold" : "bg-light"
            }`}
            style={{ cursor: "pointer", borderColor: "#ccc" }}
            onClick={() => setActiveTab("entry")}
          >
            Department Designation Entry
          </div>
          <div
            className={`p-2 flex-grow-1 text-center ${
              activeTab === "list" ? "bg-info fw-bold" : "bg-light"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("list")}
          >
            List of Department Designation
          </div>
        </div>

        {/* Entry Form */}
        {activeTab === "entry" && (
          <form onSubmit={handleSubmit} className="p-4">
            <p className="text-danger">
              All mandatory fields are marked with asterisk ( * )
            </p>

            <div className="mb-3 d-flex align-items-center flex-wrap">
              <label className="col-form-label me-2" style={{ width: "250px" }}>
                Designation Name (English) * :
              </label>
              <input
                className="form-control"
                value={designationNameE}
                onChange={(e) => setDesignationNameE(e.target.value)}
                maxLength={100}
                required
                style={{ maxWidth: "300px" }}
              />
              <span className="ms-3">
                Max <b>100</b> Character
              </span>
            </div>

            <div className="mb-3 d-flex align-items-center flex-wrap">
              <label className="col-form-label me-2" style={{ width: "250px" }}>
                Designation Name (Hindi) * :
              </label>
              <input
                className="form-control"
                value={designationNameH}
                onChange={(e) => setDesignationNameH(e.target.value)}
                maxLength={100}
                required
                style={{ maxWidth: "300px" }}
              />
              <span className="ms-3">
                Max <b>100</b> Character
              </span>
            </div>

            <div className="mb-3 d-flex align-items-center flex-wrap">
              <label className="col-form-label me-2" style={{ width: "250px" }}>
                Status * :
              </label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ maxWidth: "150px" }}
              >
                <option value="">---Select---</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div className="mb-3 d-flex align-items-center flex-wrap">
              <label className="col-form-label me-2" style={{ width: "250px" }}>
                Display Order * :
              </label>
              <select
                className="form-select"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                style={{ maxWidth: "150px" }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary px-4 py-1">
              {editId ? "Update" : "Submit"}
            </button>
          </form>
        )}

        {/* List Table */}
        {activeTab === "list" && (
          <div className="p-4">
            <div className="table-responsive">
              <table className="table table-bordered text-center designation-table">
                <thead className="table-primary">
                  <tr>
                    <th>Sr No</th>
                    <th>Designation Code</th>
                    <th>Designation Level</th>
                    <th>Designation Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {designations.map((item, index) => (
                    <tr
                      key={item._id || `designation-${index}`}
                      className={
                        index % 2 === 0 ? "table-row-blue" : "table-row-white"
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.designation_cd}</td>
                      <td>{item.order_no}</td>
                      <td>{item.designation_name_E}</td>
                      <td>
                        <a
                          href="#"
                          className="text-primary text-decoration-underline"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignationMaster;
