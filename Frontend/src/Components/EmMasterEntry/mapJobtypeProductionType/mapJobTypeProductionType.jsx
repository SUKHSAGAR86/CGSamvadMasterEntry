import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MapJobTypeProductionType = () => {
  const [formData, setFormData] = useState({
    job_type_id: "",
    job_type: "",
    production_type_id: "",
    production_type: "",
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
      const res = await axios.get(
        "http://localhost:3080/api/jobtypeproductiontype/get-jobtypeproductiontype"
      );
      setDataList(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleEdit = (record) => {
    setFormData({
      job_type_id: record.job_type_id,
      job_type: record.job_type,
      production_type_id: record.production_type_id,
      production_type: record.production_type,
      status: record.status?.toString() ?? "",
    });
    setEditId(record.production_type_id);
    setErrors({});
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClear = () => {
    setFormData({
      job_type_id: "",
      job_type: "",
      production_type_id: "",
      production_type: "",
      status: "",
    });
    setEditId(null);
    setErrors({});
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const jobTypeId = formData.job_type_id.trim();
    const jobType = formData.job_type.trim();
    const productionTypeId = formData.production_type_id.trim();
    const productionType = formData.production_type.trim();

    if (!jobTypeId) {
      newErrors.job_type_id = "Job Type ID is required";
    } else if (!/^\d+$/.test(jobTypeId)) {
      newErrors.job_type_id = "Only numeric values allowed";
    }

    if (!jobType) {
      newErrors.job_type = "Job Type is required";
    } else if (!/^[A-Za-z ]+$/.test(jobType)) {
      newErrors.job_type = "Only letters and spaces allowed";
    }

    if (!productionTypeId) {
      newErrors.production_type_id = "Production Type ID is required";
    } else if (!/^\d+$/.test(productionTypeId)) {
      newErrors.production_type_id = "Only numeric values allowed";
    }

    if (!productionType) {
      newErrors.production_type = "Production Type is required";
    } else if (!/^[A-Za-z ]+$/.test(productionType)) {
      newErrors.production_type = "Only letters and spaces allowed";
    }

    if (formData.status !== "1" && formData.status !== "0") {
      newErrors.status = "Status must be Active or Inactive";
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
          `http://localhost:3080/api/jobtypeproductiontype/update-jobtypeproductiontype/${editId}`,
          formData
        );
        showAlert("Record updated successfully");
      } else {
        await axios.post(
          "http://localhost:3080/api/jobtypeproductiontype/add-jobtypeproductiontype",
          formData
        );
        showAlert("Record added successfully");
      }
      fetchData();
      handleClear();
    } catch (err) {
      showAlert(err.response?.data || "Error occurred", "danger");
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = dataList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(dataList.length / rowsPerPage);

  const exportExcel = () => {
    const data = currentRows.map((item) => ({
      "Job Type ID": item.job_type_id,
      "Job Type": item.job_type,
      "Production Type ID": item.production_type_id,
      "Production Type": item.production_type,
      Status: item.status === "1" ? "Active" : "Inactive",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MapJobTypeProductionType");
    XLSX.writeFile(wb, "MapJobTypeProductionType.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("JobType to ProductionType Mapping", 14, 10);
    autoTable(doc, {
      startY: 15,
      head: [
        [
          "Job Type ID",
          "Job Type",
          "Production Type ID",
          "Production Type",
          "Status",
        ],
      ],
      body: currentRows.map((item) => [
        item.job_type_id,
        item.job_type,
        item.production_type_id,
        item.production_type,
        item.status === "1" ? "Active" : "Inactive",
      ]),
    });
    doc.save("MapJobTypeProductionType.pdf");
  };

  return (
    <div className="container mt-4">
      {alert.show && (
        <div
          className={`alert alert-dismissible fade show bg-light border border-2`}
          role="alert"
        >
          <strong className={`text-${alert.type}`}>{alert.message}</strong>
        </div>
      )}

      {/* FORM */}
      <div ref={formRef} className="mb-4">
        <form onSubmit={handleSubmit}>
          <div className="border p-3 rounded">
            <h5 className="text-center mb-4 fw-bold bg-primary-subtle p-2">
              Map Job Type to Production Type
            </h5>

            <div className="row mb-2">
              <div className="col-md-4">
                <label>Job Type ID</label>
                <input
                  type="text"
                  name="job_type_id"
                  className={`form-control ${
                    errors.job_type_id ? "is-invalid" : ""
                  }`}
                  value={formData.job_type_id}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.job_type_id}</div>
              </div>
              <div className="col-md-4">
                <label>Job Type</label>
                <input
                  type="text"
                  name="job_type"
                  className={`form-control ${
                    errors.job_type ? "is-invalid" : ""
                  }`}
                  value={formData.job_type}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.job_type}</div>
              </div>
              <div className="col-md-4">
                <label>Production Type ID</label>
                <input
                  type="text"
                  name="production_type_id"
                  className={`form-control ${
                    errors.production_type_id ? "is-invalid" : ""
                  }`}
                  value={formData.production_type_id}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">
                  {errors.production_type_id}
                </div>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-md-6">
                <label>Production Type</label>
                <input
                  type="text"
                  name="production_type"
                  className={`form-control ${
                    errors.production_type ? "is-invalid" : ""
                  }`}
                  value={formData.production_type}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.production_type}</div>
              </div>
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
<div className="mt-5">
    <hr />
</div>
      {/* EXPORT + TABLE */}
      <div className="fw-bold bg-danger-subtle p-2 mb-3">
      <h5 className="text-center">Job Type to Production Type List</h5>
      </div>
      <div className="d-flex justify-content-end mb-2">
          <span> 
          <button
            onClick={exportExcel}
            className="btn btn-success btn-sm me-2"
            type="button"
          >
            <i className="bi bi-file-earmark-excel"></i> Export Excel
          </button>
          <button
            onClick={exportPDF}
            className="btn btn-danger btn-sm"
            type="button"
          >
            <i className="bi bi-file-earmark-pdf"></i> Export PDF
          </button>
        </span>
      </div>

      <table className="table table-bordered text-center">
        <thead className=" text-white fw-bold">
          <tr>
            <th>Job Type ID</th>
            <th>Job Type</th>
            <th>Production Type ID</th>
            <th>Production Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((item) => (
            <tr key={item.job_type_id + "_" + item.production_type_id}>
              <td>{item.job_type_id}</td>
              <td>{item.job_type}</td>
              <td>{item.production_type_id}</td>
              <td>{item.production_type}</td>
              <td>
                <span
                  className={`badge rounded-pill ${
                    item.status === "1" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  type="button"
                  onClick={() => handleEdit(item)}
                >
                  <i className="bi bi-pencil-square"></i>{" "}
                  <span className="d-none d-md-inline">Edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                type="button"
                onClick={() => setCurrentPage(1)}
              >
                First
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                type="button"
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
                  type="button"
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
                type="button"
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
                type="button"
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

export default MapJobTypeProductionType;
