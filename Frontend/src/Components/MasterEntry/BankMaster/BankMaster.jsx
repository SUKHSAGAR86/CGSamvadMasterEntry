
import React, { useState, useEffect } from "react";
import axios from "axios";

const BankMaster = () => {
  const [formData, setFormData] = useState({
    State: "",
    District: "",
    BankName: "",
    BranchName: "",
    BranchAddress: "",
    ContactNo: "",
    IFSCCode: "",
    MICRCode: "",
    Status: "",
  });

  const [errors, setErrors] = useState({});
  const [ submitted, setSubmitted] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [editSno, setEditSno] = useState(null);

  // Alert state for modal
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchBankRecords();
  }, []);

  const fetchBankRecords = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/bankmaster/get-bankmaster");
      setBankList(res.data);
    } catch (err) {
      console.error("Error fetching bank records:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.State) newErrors.State = "State is required";
    if (!formData.District) newErrors.District = "District is required";
    if (!formData.BankName) newErrors.BankName = "Bank Name is required";
    if (!formData.BranchName) newErrors.BranchName = "Branch Name is required";
    if (!formData.MICRCode) newErrors.MICRCode = "MICR Code is required";
    else if (!/^\d{9}$/.test(formData.MICRCode))
      newErrors.MICRCode = "MICR Code must be 9 digits";
    if (!formData.IFSCCode) newErrors.IFSCCode = "IFSC Code is required";
    else if (!/^[A-Za-z]{4}0[A-Z0-9]{6}$/.test(formData.IFSCCode))
      newErrors.IFSCCode = "Invalid IFSC Code format";
    if (formData.ContactNo && !/^\d{10}$/.test(formData.ContactNo))
      newErrors.ContactNo = "Contact number must be 10 digits";
    if (!formData.Status) newErrors.Status = "Status is required";
    return newErrors;
  };

  const handleClear = () => {
    setFormData({
      State: "",
      District: "",
      BankName: "",
      BranchName: "",
      BranchAddress: "",
      ContactNo: "",
      IFSCCode: "",
      MICRCode: "",
      Status: "",
    });
    setErrors({});
    setSubmitted(false);
    setEditSno(null);
  };

  // Show alert modal and hide after 3 seconds
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    try {
      if (editSno) {
        await axios.put(`http://localhost:3080/api/bankmaster/update-bankmaster/${editSno}`, {
          BANKNM: formData.BankName,
          IFSCCODE: formData.IFSCCode,
          MICRCODE: formData.MICRCode,
          BRANCHNM: formData.BranchName,
          BRANCHADDRESS: formData.BranchAddress,
          CONTACTDETAILS: formData.ContactNo,
          CENTRE: "",
          DISTRICT: formData.District,
          STATE: formData.State,
          status: parseInt(formData.Status),
          modify_by_user_id: "admin",
          modify_by_user_name: "Admin User",
          modify_ip_address: "127.0.0.1",
        });
        showAlert("Bank record updated successfully!");
      } else {
        await axios.post("http://localhost:3080/api/bankmaster/add-bankmaster", {
          BANKNM: formData.BankName,
          IFSCCODE: formData.IFSCCode,
          MICRCODE: formData.MICRCode,
          BRANCHNM: formData.BranchName,
          BRANCHADDRESS: formData.BranchAddress,
          CONTACTDETAILS: formData.ContactNo,
          CENTRE: "",
          DISTRICT: formData.District,
          STATE: formData.State,
          status: parseInt(formData.Status),
          entry_by_user_id: "admin",
          entry_by_user_name: "Admin User",
          ip_address: "127.0.0.1",
        });
        showAlert("Bank record added successfully!");
      }
      setSubmitted(true);
      setErrors({});
      setEditSno(null);
      setFormData({
        State: "",
        District: "",
        BankName: "",
        BranchName: "",
        BranchAddress: "",
        ContactNo: "",
        IFSCCode: "",
        MICRCode: "",
        Status: "",
      });
      fetchBankRecords();
    } catch (err) {
      console.error("Error submitting form:", err);
      showAlert("Error submitting form", "danger");
    }
  };

  const handleEdit = (record) => {
    setFormData({
      State: record.STATE || "",
      District: record.DISTRICT || "",
      BankName: record.BANKNM || "",
      BranchName: record.BRANCHNM || "",
      BranchAddress: record.BRANCHADDRESS || "",
      ContactNo: record.CONTACTDETAILS || "",
      IFSCCode: record.IFSCCODE || "",
      MICRCode: record.MICRCODE || "",
      Status: record.status ? record.status.toString() : "",
    });
    setEditSno(record.Sno);
    setSubmitted(false);
    setErrors({});
  };

  return (
    <div className="container mt-4">
      {/* Alert Modal */}
      {alert.show && (
        <div
          className={`modal fade show d-block`}
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
          >
            <div className={`modal-content border-${alert.type}`}>
              <div
                className={`modal-header bg-${alert.type} text-white`}
              >
                <h5 className="modal-title">Notification</h5>
              </div>
              <div className="modal-body">
                <p>{alert.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center">
        <h5>
          <strong>* FINANCIAL YEAR : 2025 - 2026 *</strong>
        </h5>
      </div>

      <form className  onSubmit={handleSubmit} noValidate>
        <div
          className="border p-4 rounded mb-5"
          style={{ border: "2px solid #009fe3" }}
        >
          <h5 className="bi bi-bank2 text-center mb-4 fw-bold bg-primary-subtle p-2 mb-5 ">&nbsp;
            Bank Detail
          </h5>

          {/* Remove inline success alert - handled by modal */}

          <div className="row mb-3">
            <div className="col-sm-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label">
                State <span className="text-danger">*</span>:
              </label>
              <input
                type="text"
                className={`form-control ${errors.State ? "is-invalid" : ""}`}
                name="State"
                value={formData.State}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.State}</div>
            </div>
            <div className="col-sm-12 col-md-6">
              <label className="form-label">
                District <span className="text-danger">*</span>:
              </label>
              <input
                type="text"
                className={`form-control ${errors.District ? "is-invalid" : ""}`}
                name="District"
                value={formData.District}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.District}</div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label">
                Bank Name <span className="text-danger">*</span>:
              </label>
              <input
                type="text"
                className={`form-control ${errors.BankName ? "is-invalid" : ""}`}
                name="BankName"
                value={formData.BankName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.BankName}</div>
            </div>
            <div className="col-sm-12 col-md-6">
              <label className="form-label">
                Branch Name <span className="text-danger">*</span>:
              </label>
              <input
                type="text"
                className={`form-control ${errors.BranchName ? "is-invalid" : ""}`}
                name="BranchName"
                value={formData.BranchName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.BranchName}</div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12">
              <label className="form-label">Branch Address:</label>
              <textarea
                className="form-control"
                rows={2}
                name="BranchAddress"
                value={formData.BranchAddress}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label">Contact No.:</label>
              <input
                type="text"
                className={`form-control ${errors.ContactNo ? "is-invalid" : ""}`}
                name="ContactNo"
                value={formData.ContactNo}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.ContactNo}</div>
            </div>
            <div className="col-sm-12 col-md-3">
              <label className="form-label">
                IFSC Code <span className="text-danger">*</span>:
              </label>
              <input
                type="text"
                className={`form-control ${errors.IFSCCode ? "is-invalid" : ""}`}
                name="IFSCCode"
                value={formData.IFSCCode}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.IFSCCode}</div>
            </div>
            <div className="col-sm-12 col-md-3">
              <label className="form-label">
                MICR Code <span className="text-danger">*</span>:
              </label>
              <input
                type="text"
                className={`form-control ${errors.MICRCode ? "is-invalid" : ""}`}
                name="MICRCode"
                value={formData.MICRCode}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.MICRCode}</div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-sm-12 col-md-3">
              <label className="form-label">
                Status <span className="text-danger">*</span>:
              </label>
              <select
                className={`form-select ${errors.Status ? "is-invalid" : ""}`}
                name="Status"
                value={formData.Status}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              <div className="invalid-feedback">{errors.Status}</div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button type="submit" className="btn btn-primary">
              {editSno ? "Update" : "Submit"}
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
      </form >

      {/* List of Bank Records */}
      <div className="mt-5">
        <h5 className="text-center mb-4 fw-bold bg-danger-subtle p-2 mt-5 ">Bank Records</h5>
        <table className="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th className="bg-secondary ">Sno</th>
              <th className="bg-secondary ">State</th>
              <th className="bg-secondary ">District</th>
              <th className="bg-secondary ">Bank Name</th>
              <th className="bg-secondary ">Branch Name</th>
              <th className="bg-secondary ">IFSC Code</th>
              <th className="bg-secondary ">MICR Code</th>
              <th className="bg-secondary ">Status</th>
              <th className="bg-secondary ">Edit</th>
            </tr>
          </thead>
          <tbody>
            {bankList.length > 0 ? (
              bankList.map((bank) => (
                <tr key={bank.Sno}>
                  <td>{bank.Sno}</td>
                  <td>{bank.STATE}</td>
                  <td>{bank.DISTRICT}</td>
                  <td>{bank.BANKNM}</td>
                  <td>{bank.BRANCHNM}</td>
                  <td>{bank.IFSCCODE}</td>
                  <td>{bank.MICRCODE}</td>
                  <td>{bank.status === 1 ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning bi bi-pen-fill"
                      onClick={() => handleEdit(bank)}
                    >&nbsp;
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankMaster;
