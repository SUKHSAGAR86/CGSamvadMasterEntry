import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const UploadFileExtension = () => {
  const [formData, setFormData] = useState({
    sno: "",
    file_extension: "",
    status: "",
    Hoarding_upload_flag: 0,
    tender_upload_flag: 0,
  });

  const [data, setData] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/uploadfileextension/get-uploadfileextension");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? (checked ? 1 : 0) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 2500);
  };

  const validate = () => {
    const { file_extension, status } = formData;
    if (!file_extension || !status) {
      showAlert("File extension and status are required", "danger");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:3080/api/uploadfileextension/update-uploadfileextension/${formData.sno}`,
          formData
        );
        showAlert("Record updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/uploadfileextension/add-uploadfileextension", formData);
        showAlert("Record added successfully");
      }

      setFormData({
        sno: "",
        file_extension: "",
        status: "",
        Hoarding_upload_flag: 0,
        tender_upload_flag: 0,
      });
      setIsEdit(false);
      fetchData();
    } catch (err) {
      showAlert("An error occurred", "danger");
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setFormData(record);
    setIsEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container w-md-25 mt-5 ">
      <h3 className="text-center mb-4 bg-success-subtle p-2 rounded">Upload File Extension</h3>

      {/* Center Alert Box */}
      {alert.show && (
        <div className="position-fixed top-50 start-50 translate-middle z-3 w-50">
          <div className={`alert alert-${alert.type} text-center`} role="alert">
            {alert.message}
          </div>
        </div>
      )}

      {/* Form */}
      <form className="border p-4 rounded shadow-sm bg-light" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">File Extension</label>
            <input
              type="text"
              name="file_extension"
              value={formData.file_extension}
              className="form-control"
              onChange={handleChange}
              placeholder="e.g., .pdf"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              className="form-select"
              onChange={handleChange}
            >
              <option value="">-- Select Status --</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <div className="form-check">
              <input
                type="checkbox"
                name="Hoarding_upload_flag"
                checked={formData.Hoarding_upload_flag === 1}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label">Hoarding Upload</label>
            </div>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <div className="form-check">
              <input
                type="checkbox"
                name="tender_upload_flag"
                checked={formData.tender_upload_flag === 1}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label">Tender Upload</label>
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
  <button
    type="submit"
    className="btn btn-primary me-2 bi-check-circle-fill fw-bold"
  >
    &nbsp;{isEdit ? "Update" : "Submit"}
  </button>

  {isEdit ? (
    <button
      type="button"
      className="btn btn-danger bi-x-circle-fill fw-bold"
      onClick={() => {
        setFormData({
          sno: "",
          file_extension: "",
          status: "",
          Hoarding_upload_flag: 0,
          tender_upload_flag: 0,
        });
        setIsEdit(false);
      }}
    >
      &nbsp;Cancel
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-outline-danger me-2 bi-eraser-fill fw-bold"
      onClick={() =>
        setFormData({
          sno: "",
          file_extension: "",
          status: "",
          Hoarding_upload_flag: 0,
          tender_upload_flag: 0,
        })
      }
    >
      &nbsp;Clear
    </button>
  )}
</div>

      </form>
      <hr />
      {/* Table */}
      <div className="mt-5 text-center">
        <h5>Existing Records</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Extension</th>
                <th>Status</th>
                <th>Hoarding</th>
                <th>Tender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {data.length > 0 ? (
    data.map((row) => (
      <tr key={row.sno}>
        <td>{row.sno}</td>
        <td>{row.file_extension}</td>
        <td>
          <span
            className={`badge px-3 py-2 ${
              row.status === "Active" ? "bg-success" : "bg-secondary"
            }`}
          >
            {row.status}
          </span>
        </td>
        <td>{row.Hoarding_upload_flag ? "Yes" : "No"}</td>
        <td>{row.tender_upload_flag ? "Yes" : "No"}</td>
        <td>
          <button
            className="btn btn-sm btn-warning bi-pen-fill fw-bold"
            onClick={() => handleEdit(row)}
          >&nbsp;
           Edit
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center">
        No records found.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadFileExtension;
