import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MapVendorGroup = () => {
  const [formData, setFormData] = useState({
    group_id: "",
    group_name: "",
    vendor_id: "",
    vendor_name: "",
    status: "",
  });

  const [dataList, setDataList] = useState([]);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/mapvendorgroup/get-mapvendorgroup");
      setDataList(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditId(record.vendor_id); // can remain same
    setErrors({});
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClear = () => {
    setFormData({
      group_id: "",
      group_name: "",
      vendor_id: "",
      vendor_name: "",
      status: "",
    });
    setEditId(null);
    setErrors({});
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const { group_id, group_name, vendor_id, vendor_name, status } = formData;

    if (!group_id) newErrors.group_id = "Group ID is required";
    if (!group_name) newErrors.group_name = "Group Name is required";
    if (!vendor_id) newErrors.vendor_id = "Vendor ID is required";
    if (!vendor_name) newErrors.vendor_name = "Vendor Name is required";
    if (status !== "0" && status !== "1") newErrors.status = "Status must be Active or Inactive";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editId) {
       await axios.put(`http://localhost:3080/api/mapvendorgroup/update-mapvendorgroup/${formData.vendor_id}/${formData.group_id}`, formData);

        showAlert("Record updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/mapvendorgroup/add-mapvendorgroup", formData);
        showAlert("Record added successfully");
      }
      fetchData();
      handleClear();
    } catch (err) {
      showAlert(err.response?.data?.error || "Error occurred", "danger");
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = dataList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(dataList.length / rowsPerPage);

  const exportExcel = () => {
    const data = currentRows.map((item) => ({
      "Group ID": item.group_id,
      "Group Name": item.group_name,
      "Vendor ID": item.vendor_id,
      "Vendor Name": item.vendor_name,
      Status: item.status === "1" ? "Active" : "Inactive",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MapVendorGroup");
    XLSX.writeFile(wb, "MapVendorGroup.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor Group Mapping", 14, 10);
    autoTable(doc, {
      startY: 15,
      head: [["Group ID", "Group Name", "Vendor ID", "Vendor Name", "Status"]],
      body: currentRows.map((item) => [
        item.group_id,
        item.group_name,
        item.vendor_id,
        item.vendor_name,
        item.status === "1" ? "Active" : "Inactive",
      ]),
    });
    doc.save("MapVendorGroup.pdf");
  };

  return (
    <div className="container mt-4">
      {alert.show && (
        <div className="position-fixed top-50 start-50 translate-middle z-3">
          <div className={`alert alert-${alert.type} text-center border border-2 shadow fw-bold`}>
            {alert.message}
          </div>
        </div>
      )}

      <div ref={formRef} className="mb-4">
        <form onSubmit={handleSubmit}>
          <div className="border p-3 rounded">
            <h5 className="text-center mb-4 fw-bold bg-primary-subtle p-2">Map Vendor to Group</h5>
            <div className="row mb-2">
              {["group_id", "group_name", "vendor_id", "vendor_name"].map((field) => (
                <div className="col-md-3" key={field}>
                  <label>{field.replace(/_/g, " ").toUpperCase()}</label>
                  <input
                    type="text"
                    name={field}
                    className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors[field]}</div>
                </div>
              ))}
              <div className="col-md-3">
                <label>Status</label>
                <select
                  name="status"
                  className={`form-select ${errors.status ? "is-invalid" : ""}`}
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
                <div className="invalid-feedback">{errors.status}</div>
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button type="submit" className="btn btn-primary">
                {editId ? "Update" : "Submit"}
              </button>
              <button type="button" className="btn btn-danger" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="fw-bold bg-danger-subtle p-2 mb-3">
        <h5 className="text-center">Vendor Group Mapping List</h5>
      </div>
      <div className="d-flex justify-content-end mb-2">
        <button onClick={exportExcel} className="btn btn-success btn-sm me-2">Export Excel</button>
        <button onClick={exportPDF} className="btn btn-danger btn-sm">Export PDF</button>
      </div>

      <table className="table table-bordered text-center">
        <thead className="text-white bg-dark">
          <tr>
            <th>Group ID</th>
            <th>Group Name</th>
            <th>Vendor ID</th>
            <th>Vendor Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((item, index) => (
            <tr key={`${item.vendor_id}_${item.group_id}_${index}`}>
              <td>{item.group_id}</td>
              <td>{item.group_name}</td>
              <td>{item.vendor_id}</td>
              <td>{item.vendor_name}</td>
              <td>
                <span className={`badge rounded-pill ${item.status === "1" ? "bg-success" : "bg-secondary"}`}>
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button className="btn btn-warning btn-sm" type="button" onClick={() => handleEdit(item)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Prev</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)}>Last</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MapVendorGroup;
