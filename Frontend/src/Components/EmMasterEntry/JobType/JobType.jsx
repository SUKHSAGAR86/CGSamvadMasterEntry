
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const JobType = () => {
  const [formData, setFormData] = useState({ job_type_text: "", status: "" });
  const [jobList, setJobList] = useState([]);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const formRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchJobTypes();
  }, []);

  const fetchJobTypes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3080/api/jobtype/get-jobtype"
      );
      setJobList(res.data);
    } catch (err) {
      console.error("Error fetching job types:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEdit = (record) => {
    setFormData({
      job_type_text: record.job_type_text,
      status: record.status.toString(),
    });
    setEditId(record.job_type_id);
    setErrors({});
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClear = () => {
    setFormData({ job_type_text: "", status: "" });
    setEditId(null);
    setErrors({});
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1000);
  };
  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Job Types - Page " + currentPage, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["ID", "Job Type", "Status"]],
      body: currentRows.map(({ job_type_id, job_type_text, status }) => [
        job_type_id,
        job_type_text,
        status === "1" ? "Active" : "Inactive",
      ]),
    });

    doc.save(`Job_Types_Page_${currentPage}.pdf`);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = currentRows.map(({ job_type_id, job_type_text, status }) => ({
      ID: job_type_id,
      JobType: job_type_text,
      Status: status === "1" ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Types");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Job_Types_Page_${currentPage}.xlsx`);
  };

  // Validation form
  const validate = () => {
    const newErrors = {};
    const jobText = formData.job_type_text.trim();

    if (!jobText) {
      newErrors.job_type_text = "Job Type is required";
    } else if (!/^[A-Za-z]/.test(jobText)) {
      newErrors.job_type_text = "First character must be a letter";
    } else if (!/^[A-Za-z][A-Za-z0-9\s]*$/.test(jobText)) {
      newErrors.job_type_text = "Only letters, numbers, and spaces allowed";
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
        await axios.put(
          `http://localhost:3080/api/jobtype/update-jobtype/${editId}`,
          {
            job_type_text: formData.job_type_text,
            status: formData.status,
          }
        );
        showAlert("Job type updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/jobtype/add-jobtype", {
          job_type_text: formData.job_type_text,
          status: formData.status,
        });
        showAlert("Job type added successfully");
      }

      fetchJobTypes();
      handleClear();
    } catch (err) {
      const message = err.response?.data || "Failed to submit";
      showAlert(message, "danger");
    }
  };

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = jobList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(jobList.length / rowsPerPage);

  return (
    <div className="container mt-4">
      {/* Alert */}
      {alert.show && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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

      {/* Form */}
      <div ref={formRef}>
        <form onSubmit={handleSubmit} noValidate>
          <div
            className="border p-4 rounded"
            style={{ border: "2px solid #009fe3" }}
          >
            <h5 className="text-center mb-4 fw-bold bg-primary-subtle p-2">
              <i className="bi bi-briefcase-fill me-2"></i>Job Type Master
            </h5>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">
                  Job Type <span className="text-danger">*</span>:
                </label>
                <input
                  type="text"
                  name="job_type_text"
                  className={`form-control ${
                    errors.job_type_text ? "is-invalid" : ""
                  }`}
                  value={formData.job_type_text}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.job_type_text}</div>
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Status <span className="text-danger">*</span>:
                </label>
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
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      <hr className="my-4" />

      {/* Export buttons */}
      <div className="d-flex justify-content-end gap-2 mb-2">
        <button className="btn btn-success btn-sm" onClick={handleExportExcel}>
          <i className="bi bi-file-earmark-excel-fill"></i> Export Excel
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleExportPDF}>
          <i className="bi bi-file-earmark-pdf-fill"></i> Export PDF
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead>
            <tr>
              <th className="bg-secondary text-white">ID</th>
              <th className="bg-secondary text-white">Job Type</th>
              <th className="bg-secondary text-white">Status</th>
              <th className="bg-secondary text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((job) => (
                <tr key={job.job_type_id}>
                  <td>{job.job_type_id}</td>
                  <td>{job.job_type_text}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 fw-semibold ${
                        job.status === "1" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {job.status === "1" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm d-flex align-items-center gap-1 mx-auto"
                      onClick={() => handleEdit(job)}
                    >
                      <i className="bi bi-pencil-fill"></i>
                      <span className="d-none d-md-inline">Edit</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)}>
                First
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Prev
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </button>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default JobType;
