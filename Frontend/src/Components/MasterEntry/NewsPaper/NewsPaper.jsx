import React, { useEffect, useState } from "react";
import axios from "axios";

const initialForm = {
  np_cd: "",
  np_name: "",
  edition: "",
  type: "",
  language_id: "",
  language: "",
  status: "",
  rni_reg_no: "",
  bank_acount_no: "",
  bank_name: "",
  ifsc_code: "",
  display_order: "",
  who_created: "",
  is_eligible_for_gst: "",
  is_gst_verified_by_admin: "",
  CONTACT: "",
  DESN: "",
  NPADDR1: "",
  NPADDR2: "",
  NPADDR3: "",
  NPSTATE: "",
  NPSTATE_text: "",
  NPCITY: "",
  NPCITY_text: "",
  NPPOSTAL_cd: "",
  NPPHONE: "",
  YROPBAL: "",
  COMMPERC: "",
  NPNAME: "",
  GST_legalName: "",
  GST_number: "",
  GST_StateID: "",
  GST_StateText: "",
  GST_DateOfRegistration: "",
  GST_TaxpayerType: "",
  GST_Trade_Name: "",
  GST_DateOfIssue: "",
  State_Code: "",
  District_Code: "",
  State_Text: "",
  District_Text: "",
  np_info: "",
  entry_by_user_id: "",
  entry_by_user_name: "",
  modify_by_user_id: "",
  modify_by_user_name: "",
};
function NewsPaper() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [records, setRecords] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Fetch all records on load or after changes
  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/newspaper/get-newspaper");
      setRecords(res.data || []);
    } catch (err) {
      setAlert({
        message: "Failed to load records: " + err.message,
        type: "danger",
      });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Validation - you can add more validations per field as needed
  const validate = () => {
    let tempErrors = {};
    if (!form.np_cd) tempErrors.np_cd = "Code is required";
    if (!form.np_name) tempErrors.np_name = "Name is required";
    if (!form.edition) tempErrors.edition = "Edition is required";
    if (!form.type) tempErrors.type = "Type is required";
    if (!form.language_id) tempErrors.language_id = "Language ID is required";
    if (!form.language) tempErrors.language = "Language is required";
    if (![0, 1].includes(Number(form.status)))
      tempErrors.status = "Status must be 0 or 1";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post("http://localhost:3080/api/newspaper/add-newspaper", form);
      showAlert("News Paper created successfully!", "success");
      setForm(initialForm);
      fetchRecords();
    } catch (err) {
      showAlert(
        "Create failed: " + (err.response?.data || err.message),
        "danger"
      );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.put(
        `http://localhost:3080/api/nwespaper/update-newspaper/${form.np_cd}`,
        form
      );
      showAlert("News Paper updated successfully!", "success");
      setIsUpdateMode(false);
      setForm(initialForm);
      fetchRecords();
    } catch (err) {
      showAlert(
        "Update failed: " + (err.response?.data || err.message),
        "danger"
      );
    }
  };
  const loadForUpdate = (record) => {
    setForm(record);
    setErrors({});
    setAlert({ message: "", type: "" });
    setIsUpdateMode(true);
  };

  const CenteredAlert = () => {
    if (!alert.message) return null;
    return (
      <div
        className={`alert alert-${alert.type} position-fixed`}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          minWidth: "320px",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
        }}
        role="alert"
      >
        {alert.message}
        <button
          type="button"
          className="btn-close float-end"
          aria-label="Close"
          onClick={() => setAlert({ message: "", type: "" })}
          style={{ cursor: "pointer" }}
        />
      </div>
    );
  };

  return (
    <>
      <CenteredAlert />
      <div className="container my-4">
        <h2 className="mb-4 text-center bg-success-subtle p-2 rounded">
          {isUpdateMode ? "Update News Paper" : "News Paper"}
        </h2>

        <form onSubmit={isUpdateMode ? handleUpdate : handleSubmit} noValidate>
          {/* Bootstrap rows and columns for inputs */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="np_cd" className="form-label">
                Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="np_cd"
                name="np_cd"
                className={`form-control ${errors.np_cd ? "is-invalid" : ""}`}
                value={form.np_cd}
                onChange={handleChange}
                disabled={isUpdateMode}
              />
              <div className="invalid-feedback">{errors.np_cd}</div>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="np_name" className="form-label">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="np_name"
                name="np_name"
                className={`form-control ${errors.np_name ? "is-invalid" : ""}`}
                value={form.np_name}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.np_name}</div>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="edition" className="form-label">
                Edition <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="edition"
                name="edition"
                className={`form-control ${errors.edition ? "is-invalid" : ""}`}
                value={form.edition}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.edition}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="type" className="form-label">
                Type <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="type"
                name="type"
                className={`form-control ${errors.type ? "is-invalid" : ""}`}
                value={form.type}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.type}</div>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="language_id" className="form-label">
                Language ID <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="language_id"
                name="language_id"
                className={`form-control ${
                  errors.language_id ? "is-invalid" : ""
                }`}
                value={form.language_id}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.language_id}</div>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="language" className="form-label">
                Language <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="language"
                name="language"
                className={`form-control ${
                  errors.language ? "is-invalid" : ""
                }`}
                value={form.language}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.language}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="status" className="form-label">
                Status <span className="text-danger">*</span>
              </label>
              <select
                id="status"
                name="status"
                className={`form-select ${errors.status ? "is-invalid" : ""}`}
                value={form.status}
                onChange={handleChange}
              >
                <option value="">-- Select Status --</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              <div className="invalid-feedback">{errors.status}</div>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="rni_reg_no" className="form-label">
                RNI Reg No
              </label>
              <input
                type="text"
                id="rni_reg_no"
                name="rni_reg_no"
                className="form-control"
                value={form.rni_reg_no}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="display_order" className="form-label">
                Display Order
              </label>
              <input
                type="text"
                id="display_order"
                name="display_order"
                className="form-control"
                value={form.display_order}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="bank_acount_no" className="form-label">
                Bank Account No
              </label>
              <input
                type="text"
                id="bank_acount_no"
                name="bank_acount_no"
                className="form-control"
                value={form.bank_acount_no}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="bank_name" className="form-label">
                Bank Name
              </label>
              <input
                type="text"
                id="bank_name"
                name="bank_name"
                className="form-control"
                value={form.bank_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="ifsc_code" className="form-label">
                IFSC Code
              </label>
              <input
                type="text"
                id="ifsc_code"
                name="ifsc_code"
                className="form-control"
                value={form.ifsc_code}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="is_eligible_for_gst" className="form-label">
                Eligible For GST <span className="text-danger">*</span>
              </label>
              <select
                id="is_eligible_for_gst"
                name="is_eligible_for_gst"
                className={`form-select ${
                  errors.is_eligible_for_gst ? "is-invalid" : ""
                }`}
                value={form.is_eligible_for_gst}
                onChange={handleChange}
              >
                <option value="">--Select--</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              <div className="invalid-feedback">
                {errors.is_eligible_for_gst}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="who_created" className="form-label">
                Who Created
              </label>
              <input
                type="text"
                id="who_created"
                name="who_created"
                className="form-control"
                value={form.who_created}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="is_gst_verified_by_admin" className="form-label">
                Verified By Admin<span className="text-danger">*</span>
              </label>
              <select
                id="is_gst_verified_by_admin"
                name="is_gst_verified_by_admin"
                className={`form-select ${
                  errors.is_gst_verified_by_admin ? "is-invalid" : ""
                }`}
                value={form.is_gst_verified_by_admin}
                onChange={handleChange}
              >
                <option value="">--Select--</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              <div className="invalid-feedback">
                {errors.is_gst_verified_by_admin}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="CONTACT" className="form-label">
                CONTACT
              </label>
              <input
                type="text"
                id="CONTACT"
                name="CONTACT"
                className="form-control"
                value={form.CONTACT}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="DESN" className="form-label">
                DESN
              </label>
              <input
                type="text"
                id="DESN"
                name="DESN"
                className="form-control"
                value={form.DESN}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="NPADDR1" className="form-label">
                NPADDR1
              </label>
              <input
                type="text"
                id="NPADDR1"
                name="NPADDR1"
                className="form-control"
                value={form.NPADDR1}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="NPADDR2" className="form-label">
                NPADDR2
              </label>
              <input
                type="text"
                id="NPADDR2"
                name="NPADDR2"
                className="form-control"
                value={form.NPADDR2}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="NPADDR3" className="form-label">
                NPADDR3
              </label>
              <input
                type="text"
                id="NPADDR3"
                name="NPADDR3"
                className="form-control"
                value={form.NPADDR3}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="NPSTATE" className="form-label">
                NPSTATE
              </label>
              <input
                type="text"
                id="NPSTATE"
                name="NPSTATE"
                className="form-control"
                value={form.NPSTATE}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="NPSTATE_text" className="form-label">
                NPSTATE Text
              </label>
              <input
                type="text"
                id="NPSTATE_text"
                name="NPSTATE_text"
                className="form-control"
                value={form.NPSTATE_text}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="NPCITY" className="form-label">
                NPCITY
              </label>
              <input
                type="text"
                id="NPCITY"
                name="NPCITY"
                value={form.NPCITY}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="NPCITY_text" className="form-label">
                NPCITY Text
              </label>
              <input
                type="text"
                id="NPCITY_text"
                name="NPCITY_text"
                value={form.NPCITY_text}
                className="form-control"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="NPPOSTAL_cd" className="form-label">
                NPPOSTAL Code
              </label>
              <input
                type="text"
                id="NPPOSTAL_cd"
                name="NPPOSTAL_cd"
                value={form.NPPOSTAL_cd}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="NPPHONE" className="form-label">
                NPPHONE
              </label>
              <input
                type="text"
                id="NPPHONE"
                name="NPPHONE"
                value={form.NPPHONE}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="NPNAME" className="form-label">
                NPNAME
              </label>
              <input
                type="text"
                id="NPNAME"
                name="NPNAME"
                value={form.NPNAME}
                className="form-control"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="YROPBAL" className="form-label">
                YROPBAL
              </label>
              <input
                type="number"
                step="any" // Allows decimal values
                id="YROPBAL"
                name="YROPBAL"
                value={form.YROPBAL}
                className={`form-control ${errors.YROPBAL ? "is-invalid" : ""}`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.YROPBAL}</div>
            </div>

            <div className="col-md-4 mb-2">
              <label htmlFor="COMMPERC" className="form-label">
                COMMPERC
              </label>
              <input
                type="number"
                step="any" // Allows decimal values
                id="COMMPERC"
                name="COMMPERC"
                value={form.COMMPERC}
                className={`form-control ${
                  errors.COMMPERC ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.COMMPERC}</div>
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="GST_legalName" className="form-label">
                GST Legal Name
              </label>
              <input
                type="text"
                id="GST_legalName"
                name="GST_legalName"
                value={form.GST_legalName}
                className="form-control"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="GST_number" className="form-label">
                GST Number
              </label>
              <input
                type="text"
                id="GST_number"
                name="GST_number"
                value={form.GST_number}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="GST_StateID" className="form-label">
                GST State ID
              </label>
              <input
                type="text"
                id="GST_StateID"
                name="GST_StateID"
                value={form.GST_StateID}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="GST_StateText" className="form-label">
                GST State Text
              </label>
              <input
                type="text"
                id="GST_StateText"
                name="GST_StateText"
                value={form.GST_StateText}
                className="form-control"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="GST_TaxpayerType" className="form-label">
                GST Taxpayer Type
              </label>
              <input
                type="text"
                id="GST_TaxpayerType"
                name="GST_TaxpayerType"
                value={form.GST_TaxpayerType}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="GST_Trade_Name" className="form-label">
                GST Trade Name
              </label>
              <input
                type="text"
                id="GST_Trade_Name"
                name="GST_Trade_Name"
                value={form.GST_Trade_Name}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="GST_DateOfRegistration" className="form-label">
                GST Date Of Registration
              </label>
              <input
                type="date"
                id="GST_DateOfRegistration"
                name="GST_DateOfRegistration"
                value={form.GST_DateOfRegistration}
                className={`form-control ${
                  errors.GST_DateOfRegistration ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                {errors.GST_DateOfRegistration}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 mb-2">
              <label htmlFor="GST_DateOfIssue" className="form-label">
                GST Date Of Issue
              </label>
              <input
                type="date"
                id="GST_DateOfIssue"
                name="GST_DateOfIssue"
                value={form.GST_DateOfIssue}
                className={`form-control ${
                  errors.GST_DateOfIssue ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.GST_DateOfIssue}</div>
            </div>

            <div className="col-md-4 mb-2">
              <label htmlFor="State_Code" className="form-label">
                State Code
              </label>
              <input
                type="text"
                id="State_Code"
                name="State_Code"
                value={form.State_Code}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="District_Code" className="form-label">
                District Code
              </label>
              <input
                type="text"
                id="District_Code"
                name="District_Code"
                value={form.District_Code}
                className="form-control"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="State_Text" className="form-label">
                State Text
              </label>
              <input
                type="text"
                id="State_Text"
                name="State_Text"
                value={form.State_Text}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-2">
              <label htmlFor="District_Text" className="form-label">
                District Text
              </label>
              <input
                type="text"
                id="District_Text"
                name="District_Text"
                value={form.District_Text}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <label htmlFor="np_info" className="form-label">
                NP Info
              </label>
              <select
                id="np_info"
                name="np_info"
                value={form.np_info}
                className={`form-select ${errors.np_info ? "is-invalid" : ""}`}
                onChange={handleChange}
              >
                <option value="">--Select--</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              <div className="invalid-feedback">{errors.np_info}</div>
            </div>
          </div>

          {/* You can continue adding all remaining inputs in similar fashion */}

          <div className="d-flex justify-content-center mt-4">
            {isUpdateMode ? (
              <>
                <button
                  type="submit"
                  className="btn btn-warning bi-arrow-up-circle-fill"
                >
                  &nbsp; Update
                </button>
                <button
                  type="button"
                  className="btn btn-danger bi-x-circle-fill ms-3"
                  onClick={() => {
                    setForm(initialForm);
                    setIsUpdateMode(false);
                    setErrors({});
                    setAlert({ message: "", type: "" });
                  }}
                >
                  &nbsp; Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="btn btn-primary bi-arrow-up-circle-fill"
                >
                  &nbsp; Submit
                </button>
                <button
                  type="button"
                  className="btn btn-danger bi-x-circle-fill ms-3"
                  onClick={() => {
                    setForm(initialForm);
                    setErrors({});
                    setAlert({ message: "", type: "" });
                  }}
                >
                  &nbsp; Clear
                </button>
              </>
            )}
          </div>
        </form>

        {/* Records Table */}
        <hr className="my-5" />
        <h3 className="mb-4 text-center">News Paper Records</h3>

        {records.length === 0 ? (
          <p className="text-center">No records found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Edition</th>
                  <th>Type</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.np_cd}>
                    <td>{rec.np_cd}</td>
                    <td>{rec.np_name}</td>
                    <td>{rec.edition}</td>
                    <td>{rec.type}</td>
                    <td>{rec.language}</td>
                    <td>
                      <span
                        className={`badge ${
                          rec.status === 1 ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {rec.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm bg-warning bi-pen-fill me-2"
                        onClick={() => loadForUpdate(rec)}
                      >
                        &nbsp; Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
export default NewsPaper;
