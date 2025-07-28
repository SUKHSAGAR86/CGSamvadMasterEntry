import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const JobUnit = () => {
  const [formData, setFormData] = useState({ unit_text: "", status: "" });
  const [unitList, setUnitList] = useState([]);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;


 const handleEdit = (unit) => {
    setFormData({
      unit_text: unit.unit_text,
      status: unit.status.toString(),
    });
    setEditId(unit.unit_id);
    setErrors({});
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClear = () => {
    setFormData({ unit_text: "", status: "" });
    setEditId(null);
    setErrors({});
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1000);
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = unitList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(unitList.length / rowsPerPage);

  const exportExcel = () => {
    const data = currentRows.map((unit) => ({
      ID: unit.unit_id,
      "Unit Text": unit.unit_text,
      Status: unit.status === "1" ? "Active" : "Inactive",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "JobUnit");
    XLSX.writeFile(wb, "JobUnit.xlsx");
  };

 const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("Job Unit List", 14, 10);
  autoTable(doc, {
    startY: 15,
    head: [["ID", "Unit Text", "Status"]],
    body: currentRows.map((unit) => [
      unit.unit_id,
      unit.unit_text,
      unit.status === "1" ? "Active" : "Inactive",
    ]),
  });
  doc.save("JobUnit.pdf");
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };



  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/jobunit/get-jobunit");
      setUnitList(res.data);
    } catch (err) {
      console.error("Error fetching units:", err);
    }
  };

  const validate = () => {
    const newErrors = {};
    const unitText = formData.unit_text.trim();

    if (!unitText) {
      newErrors.unit_text = "Unit Text is required";
    } else if (!/^[A-Za-z]/.test(unitText)) {
      newErrors.unit_text = "First character must be a letter";
    } else if (!/^[A-Za-z][A-Za-z0-9\s]*$/.test(unitText)) {
      newErrors.unit_text = "Only letters, numbers, and spaces allowed";
    }

    if (formData.status !== "1" && formData.status !== "0") {
      newErrors.status = "Status is required";
    }

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
        await axios.put(`http://localhost:3080/api/jobunit/update-jobunit/${editId}`, {
          unit_text: formData.unit_text,
          status: formData.status,
        });
        showAlert("Job Unit updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/jobunit/add-jobunit", {
          unit_text: formData.unit_text,
          status: formData.status,
        });
        showAlert("Job Unit added successfully");
      }

      fetchUnits();
      handleClear();
    } catch (err) {
      const message = err.response?.data || "Failed to submit";
      showAlert(message, "danger");
    }
  };

 
  return (
    <div className="container mt-4">
      {alert.show && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-${alert.type}`}>
              <div className={`modal-header bg-${alert.type} text-white`}>
                <h5 className="modal-title">Notification</h5>
              </div>
              <div className="modal-body">
                <p>{alert.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={formRef}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="border p-4 rounded" style={{ border: "2px solid #009fe3" }}>
            <h5 className="text-center mb-4 fw-bold bg-primary-subtle p-2">
              <i className="bi bi-collection-fill me-2"></i>Job Unit Master
            </h5>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Unit Text <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="unit_text"
                  className={`form-control ${errors.unit_text ? "is-invalid" : ""}`}
                  value={formData.unit_text}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.unit_text}</div>
              </div>

              <div className="col-md-3">
                <label className="form-label">Status <span className="text-danger">*</span></label>
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

            <div className="d-flex justify-content-center gap-3">
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

      <div className="mt-5">
        <h5 className="text-center fw-bold bg-danger-subtle p-2">Job Unit List</h5>

        <div className="d-flex justify-content-end mb-2 gap-2">
          <button onClick={exportExcel} className="btn btn-success btn-sm">
            <i className="bi bi-file-earmark-excel-fill me-1"></i>Export Excel
          </button>
          <button onClick={exportPDF} className="btn btn-danger btn-sm">
            <i className="bi bi-file-earmark-pdf-fill me-1"></i>Export PDF
          </button>
        </div>

        <table className="table table-bordered text-center align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Unit Text</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((unit) => (
                <tr key={unit.unit_id}>
                  <td>{unit.unit_id}</td>
                  <td>{unit.unit_text}</td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 fw-semibold ${
                        unit.status === "1" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {unit.status === "1" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm d-flex align-items-center gap-1 mx-auto"
                      onClick={() => handleEdit(unit)}
                    >
                      <i className="bi bi-pencil-square"></i>
                      <span className="d-none d-md-inline">Edit</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No records found</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
              </li>
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Prev</button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(totalPages)}>Last</button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default JobUnit;

