
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const RateCategory = () => {
  const initialState = {
    rate_category_name: "",
    alternate_name: "",
    extra_rate_percent: "",
    Rate_Multi_factor: "",
    is_for_entry: "",
    status: "",
    display_order: "",
  };

  const [rateCategories, setRateCategories] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null); // Stores the rate_category_cd for editing
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const fetchRateCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3080/api/ratecategory/get-ratecategory");
      if (Array.isArray(response.data)) {
        setRateCategories(response.data);
      } else {
        setRateCategories([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchRateCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date();
    const entry_date = date.toISOString().split("T")[0];
    const entry_time = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

    const formattedData = {
      ...formData,
      status: formData.status === "1" ? "Active" : "Inactive",
    };

    try {
      if (editId) {
        // PUT: Update existing
        await axios.put(`http://localhost:3080/api/ratecategory/update-ratecategory/${editId}`, {
          ...formattedData,
          modify_date: entry_date,
          modify_time: entry_time,
        });
        showAlert("Updated Successfully", "info");
      } else {
        // POST: Create new (exclude rate_category_cd)
        await axios.post("http://localhost:3080/api/ratecategory/add-ratecategory", {
          ...formattedData,
          entry_date,
          entry_time,
        });
        showAlert("Submitted Successfully", "success");
      }

      fetchRateCategories();
      setFormData(initialState);
      setEditId(null);
    } catch (err) {
      console.error(err);
      showAlert("Error occurred. Check console.", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      rate_category_name: item.rate_category_name,
      alternate_name: item.alternate_name,
      extra_rate_percent: item.extra_rate_percent,
      Rate_Multi_factor: item.Rate_Multi_factor,
      is_for_entry: item.is_for_entry,
      status: item.status === "Active" ? "1" : "0",
      display_order: item.display_order,
    });
    setEditId(item.rate_category_cd);
    window.scrollTo(0, 0);
  };

  const handleClear = () => {
    setFormData(initialState);
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 bg-primary text-white p-2 rounded">Rate Category</h2>

      {alert.show && (
        <div
          className={`alert alert-${alert.variant} text-center position-fixed top-50 start-50 translate-middle shadow`}
          style={{ zIndex: 1050, minWidth: "300px" }}
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3 bg-light p-4 rounded shadow-sm">
        <div className="col-md-3">
          <label className="form-label">Category Name</label>
          <input type="text" className="form-control" name="rate_category_name" 
          value={formData.rate_category_name} 
          onChange={handleChange} required />
        </div>

        <div className="col-md-3">
          <label className="form-label">Alternate Name</label>
          <input type="text" className="form-control" name="alternate_name" value={formData.alternate_name} onChange={handleChange} maxLength="5" />
        </div>
        <div className="col-md-3">
          <label className="form-label">Extra Rate %</label>
          <input type="number" className="form-control" name="extra_rate_percent" value={formData.extra_rate_percent} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Multi Factor</label>
          <input type="text" className="form-control" name="Rate_Multi_factor" value={formData.Rate_Multi_factor} onChange={handleChange} maxLength="1" />
        </div>
        <div className="col-md-3">
          <label className="form-label">Entry</label>
          <select className="form-select" name="is_for_entry" value={formData.is_for_entry} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Display Order</label>
          <input type="number" className="form-control" name="display_order" value={formData.display_order} onChange={handleChange} />
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary px-4 me-2">
            <i className={`bi ${editId ? "bi-arrow-repeat" : "bi-cloud-upload"} me-2`}></i>
            {editId ? "Update" : "Submit"}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleClear}>
            <i className="bi bi-x-circle me-2"></i>
            Clear
          </button>
        </div>
      </form>

      <div className="text-danger fw-bold mt-5"><hr /></div>

      <div className="mt-5">
        <h4 className="mb-3 text-center">All Rate Categories</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Category Code</th>
                <th>Category Name</th>
                <th>Alternate Name</th>
                <th>Rate Extra %</th>
                <th>Multi Factor</th>
                <th>Entry</th>
                <th>Status</th>
                <th>Display Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {rateCategories.length > 0 ? (
                rateCategories.map((item, index) => (
                  <tr key={item.rate_category_cd || index}>
                    <td>{item.rate_category_cd}</td>
                    <td>{item.rate_category_name}</td>
                    <td>{item.alternate_name}</td>
                    <td>{item.extra_rate_percent}</td>
                    <td>{item.Rate_Multi_factor}</td>
                    <td>{item.is_for_entry}</td>
                    <td>
                      <span className={`badge ${item.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.display_order}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2 bi bi-pencil-fill" onClick={() => handleEdit(item)}>
                        &nbsp;Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-danger">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RateCategory;
