import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "react-bootstrap";

function TaxMasterForm() {
  const initialForm = {
    tax_type: "",
    tax_percentage: "",
    update_column_name: "",
    head_type: "",
    head_id: "",
    head_text: "",
    gst_state_id: "",
    from_date: "",
    to_date: "",
    display_status: "",
    status: "",
    display_order: "",
    tax_on_sno: "",
    IS_applicableFor: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [taxList, setTaxList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const validate = () => {
    const errs = {};
    if (!formData.tax_type) errs.tax_type = "Tax Type is required";
    if (!formData.tax_percentage)
      errs.tax_percentage = "Tax Percentage is required";
    else if (isNaN(formData.tax_percentage))
      errs.tax_percentage = "Must be a number";
    if (!formData.status) errs.status = "Status is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/taxmaster/get-taxmaster");
      setTaxList(res.data);
    } catch (err) {
      showAlert("Error fetching tax data", "danger");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:3080/api/taxmaster/update-taxmaster/${formData.sno}`,
          formData
        );
        showAlert("Tax record updated");
      } else {
        const res = await axios.post(
          "http://localhost:3080/api/taxmaster/add-taxmaster",
          formData
        );
        showAlert(`Inserted with SNO: ${res.data.sno || res.data.SNO}`);
      } 

      setFormData(initialForm);
      setErrors({});
      setEditMode(false);
      fetchData();
    } catch (error) {
      showAlert(error.response?.data || error.message, "danger");
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      from_date: item.from_date?.split("T")[0] || "",
      to_date: item.to_date?.split("T")[0] || "",
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-success-subtle p-2 rounded">Tax Master Entry</h4>

      {alert.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.5)", // dim background
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Alert
            variant={alert.variant}
            onClose={() => setAlert({ show: false })}
            dismissible
            className="text-center shadow-lg fs-6 fw-bold"
            style={{
              minWidth: "300px",
              maxWidth: "90%",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {[
            {
              name: "tax_type",
              label: "Tax Type",
              required: true,
              placeholder: "Enter tax type",
            },
            {
              name: "tax_percentage",
              label: "Tax %",
              required: true,
              type: "number",
              placeholder: "Enter tax percentage",
            },
            {
              name: "update_column_name",
              label: "Update Column",
              placeholder: "Enter update column name",
            },
            {
              name: "head_type",
              label: "Head Type",
              placeholder: "Enter head type",
            },
            { name: "head_id", label: "Head ID", placeholder: "Enter head ID" },
            {
              name: "head_text",
              label: "Head Text",
              placeholder: "Enter head text",
            },
            {
              name: "gst_state_id",
              label: "GST State ID",
              placeholder: "Enter GST state ID",
            },
            {
              name: "from_date",
              label: "From Date",
              type: "date",
              placeholder: "Select from date",
            },
            {
              name: "to_date",
              label: "To Date",
              type: "date",
              placeholder: "Select to date",
            },
            {
              name: "display_status",
              label: "Display Status",
              type: "select",
              required: true,
              options: [
                { value: "", text: "------Select-----" },
                { value: "1", text: "Yes" },
                { value: "0", text: "No" },
              ],
              placeholder: "Select display status",
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              required: true,
              options: [
                { value: "", text: "------Select-----" },
                { value: "1", text: "Active" },
                { value: "0", text: "Inactive" },
              ],
              placeholder: "Select status",
            },
            {
              name: "display_order",
              label: "Display Order",
              type: "number",
              placeholder: "Enter display order",
            },
            {
              name: "tax_on_sno",
              label: "Tax On SNO",
              placeholder: "Enter tax on SNO",
            },
            {
              name: "IS_applicableFor",
              label: "Applicable For",
              placeholder: "Enter applicable for",
            },
          ].map((field) => (
            <div className="col-md-3" key={field.name}>
              <label className="form-label">
                {field.label}{" "}
                {field.required && <span className="text-danger">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  className={`form-select ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  aria-placeholder={field.placeholder} // Note: placeholder attribute is not valid for <select>
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.text}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  className={`form-control ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              )}
              <div className="invalid-feedback">{errors[field.name]}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 text-center d-flex justify-content-center gap-3 flex-wrap">
  <button
    className="btn btn-primary px-4 bi-arrow-up-circle-fill"
    type="submit"
    disabled={loading}
  >&nbsp;
    {loading ? "Submitting..." : editMode ? "Update" : "Submit"}
  </button>

  {!editMode ? (
    <button
      type="button"
      className="btn btn-danger px-4 bi-x-circle-fill"
      onClick={() => {
        setFormData(initialForm);
        setErrors({});
      }}
    >&nbsp;
      Clear
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-danger px-4 bi-x-circle-fill"
      onClick={() => {
        setFormData(initialForm);
        setErrors({});
        setEditMode(false);
      }}
    >&nbsp;
      Cancel
    </button>
  )}
</div>

      </form>

      <hr />

      <h5 className="text-center mt-5 ">Tax Master Records</h5>
      <div className="table-responsive mb-5">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-light">
            <tr>
              <th className="bg-dark text-white fw-bold">SNO</th>
              <th className="bg-dark text-white fw-bold">Tax Type</th>
              <th className="bg-dark text-white fw-bold">Tax %</th>
              <th className="bg-dark text-white fw-bold">Status</th>
              <th className="bg-dark text-white fw-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {taxList.map((item) => (
              <tr key={item.sno}>
                <td>{item.sno}</td>
                <td>{item.tax_type}</td>
                <td>{item.tax_percentage}</td>
               <td>
               <span className={`badge ${item.status==="1"?"bg-success":"bg-secondary"}`}>{item.status === "1" ? "Active" : "Inactive"}</span>
               </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning bi-pen-fill fw-bold"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {taxList.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaxMasterForm;
