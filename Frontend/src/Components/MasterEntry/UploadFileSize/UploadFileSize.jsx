import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const UploadFileSize = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ sno: "", file_size_in_bytes: "" });
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });



  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/uploadfilesize/get-uploadfilesize");
      setRecords(res.data);
    } catch (err) {
      showAlert("Failed to fetch records", "danger");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showAlert = (message, type) => {
    setAlert({ message, type, visible: true });
    setTimeout(() => setAlert({ ...alert, visible: false }), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.file_size_in_bytes) {
        showAlert("File size is required", "warning");
        return;
      }

      if (form.sno) {
        await axios.put(`http://localhost:3080/api/uploadfilesize/update-uploadfilesize/${form.sno}`, {
          file_size_in_bytes: form.file_size_in_bytes,
        });
        showAlert(" Record updated", "success");
      } else {
        await axios.post("http://localhost:3080/api/uploadfilesize/add-uploadfilesize", {
          file_size_in_bytes: form.file_size_in_bytes,
        });
        showAlert(" Record added", "success");
      }

      setForm({ sno: "", file_size_in_bytes: "" });
      fetchRecords();
    } catch (err) {
      showAlert(" Operation failed", "danger");
    }
  };

  const handleEdit = (record) => {
    setForm(record);
  };

  return (
    <div className="container mt-4 w-75">
      <h3 className="text-center mb-4">Upload File Size</h3>

      {/* Centered Alert Box */}
      {alert.visible && (
        <div
          className="position-fixed top-50 start-50 translate-middle z-3"
          style={{ minWidth: "300px", maxWidth: "90%", zIndex: 9999 }}
        >
          <div className={`alert alert-${alert.type} shadow text-center fw-bold fs-6`}>
            {alert.message}
          </div>
        </div>
      )}

      <form className="card p-4 shadow mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">File Size (in bytes)</label>
            <input
              type="number"
              name="file_size_in_bytes"
              value={form.file_size_in_bytes}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter size in bytes"
              min="0"
            />
          </div>
        </div>
        <div className="text-end">
          <button type="submit" className="btn btn-primary me-2">
            {form.sno ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            className="btn btn-outline-danger me-2 bi-eraser-fill fw-bold"
            onClick={() => setForm({ sno: "", file_size_in_bytes: "" })}
          >
            Clear
          </button>
        </div>
      </form>
      <hr />
      <table className="table table-striped table-bordered shadow-sm text-center mt-4">
        <thead className="table-dark">
          <tr>
            <th>SNO</th>
            <th>File Size (bytes)</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.sno}>
              <td>{rec.sno}</td>
              <td>{rec.file_size_in_bytes}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning bi-pen-fill fw-bold"
                  onClick={() => handleEdit(rec)}
                >
                 Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadFileSize;
