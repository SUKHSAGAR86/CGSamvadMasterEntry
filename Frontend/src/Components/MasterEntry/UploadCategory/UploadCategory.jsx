
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";



function UploadCategory() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    cat_cd: "",
    cat_name: "",
    status: "",
    display_order: ""
  });
  const [editing, setEditing] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, message: "", type: "" });

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3080/api/uploadcategory/get-uploadcategory");
    console.log("API response categories:", res.data); // Debug API response
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending status as string "Active" or "Inactive"
      const payload = { ...form };

      if (editing) {
        await axios.put(`http://localhost:3080/api/uploadcategory/update-uploadcategory/${form.cat_cd}`, payload);
        showCenterAlert("Category updated successfully", "success");
      } else {
        await axios.post("http://localhost:3080/api/uploadcategory/add-uploadcategory", payload);
        showCenterAlert("Category inserted successfully", "success");
      }

      setForm({ cat_cd: "", cat_name: "", status: "", display_order: "" });
      setEditing(false);
      fetchCategories();
    } catch (err) {
      showCenterAlert(err.response?.data?.error || "Something went wrong", "danger");
    }
  };

  const handleEdit = async (cat_cd) => {
    const res = await axios.get(`http://localhost:3080/api/uploadcategory/get-uploadcategory/${cat_cd}`);
    const data = res.data;
    // Assuming backend returns status as string "Active"/"Inactive"
    setForm({
      cat_cd: data.cat_cd,
      cat_name: data.cat_name,
      status: data.status === 1 || data.status === "1" ? "Active" : data.status === 0 || data.status === "0" ? "Inactive" : data.status,
      display_order: data.display_order
    });
    setEditing(true);
  };

  const showCenterAlert = (message, type) => {
    setShowAlert({ show: true, message, type });
    setTimeout(() => setShowAlert({ show: false, message: "", type: "" }), 3000);
  };

  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4">Upload Category Management</h2>

      {showAlert.show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: 1050 }}
        >
          <div className={`alert alert-${showAlert.type} text-center m-0`}>
            {showAlert.message}
          </div>
        </div>
      )}

    <div className=" container-fluid  justify-content-center">
    <form onSubmit={handleSubmit} className="card p-4 shadow">
        {editing && (
          <div className="mb-3">
            <label>Category Code</label>
            <input className="form-control" value={form.cat_cd} disabled />
          </div>
        )}
        <div className="mb-3">
          <label>Category Name</label>
          <input
            type="text"
            className="form-control"
            value={form.cat_name}
            onChange={(e) => setForm({ ...form, cat_name: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Status</label>
          <select
            className="form-control"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="">---Select Status---</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Display Order</label>
          <input
            type="number"
            className="form-control"
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editing ? "Update" : "Submit"}
        </button>
      </form>


    </div>
      <hr />

      <table className="table table-striped mt-4">
        <thead className="table-dark">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Status</th>
            <th>Display Order</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.cat_cd}>
              <td>{cat.cat_cd}</td>
              <td>{cat.cat_name}</td>
              <td>
                {cat.status === 1 || cat.status === "1" || cat.status === "Active"
                  ? "Active"
                  : "Inactive"}
              </td>
              <td>{cat.display_order}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEdit(cat.cat_cd)}
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
}

export default UploadCategory;
