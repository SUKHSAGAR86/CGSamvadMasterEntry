

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MapVendorCategory = () => {
  const [formData, setFormData] = useState({
    media_type_id: "",
    media_type: "",
    vendor_id: "",
    vendor_name: "",
    cate_id: "",
    cate_text: "",
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
        "http://localhost:3080/api/mapvendorcategory/get-mapvendorcategory"
      );
      setDataList(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleEdit = (record) => {
    const clean = (val) => (val === undefined || val === null ? "" : val);
    setFormData({
      media_type_id: clean(record.media_type_id),
      media_type: clean(record.media_type),
      vendor_id: clean(record.vendor_id),
      vendor_name: clean(record.vendor_name),
      cate_id: clean(record.cate_id),
      cate_text: clean(record.cate_text),
    });
    setEditId(record.media_type_id);
    setErrors({});
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClear = () => {
    setFormData({
      media_type_id: "",
      media_type: "",
      vendor_id: "",
      vendor_name: "",
      cate_id: "",
      cate_text: "",
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
    const {
      media_type_id,
      media_type,
      vendor_id,
      vendor_name,
      cate_id,
      cate_text,
    } = formData;

    if (!media_type_id) newErrors.media_type_id = "Media Type ID is required";
    if (!media_type) newErrors.media_type = "Media Type is required";
    if (!vendor_id) newErrors.vendor_id = "Vendor ID is required";
    if (!vendor_name) newErrors.vendor_name = "Vendor Name is required";
    if (!cate_id) newErrors.cate_id = "Category ID is required";
    if (!cate_text) newErrors.cate_text = "Category Text is required";

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
          `http://localhost:3080/api/mapvendorcategory/update-mapvendorcategory/${editId}`,
          formData
        );
        showAlert("Record updated successfully");
      } else {
        await axios.post(
          "http://localhost:3080/api/mapvendorcategory/add-mapvendorcategory",
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
      "Media Type ID": item.media_type_id,
      "Media Type": item.media_type,
      "Vendor ID": item.vendor_id,
      "Vendor Name": item.vendor_name,
      "Category ID": item.cate_id,
      "Category Text": item.cate_text,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MapVendorCategory");
    XLSX.writeFile(wb, "MapVendorCategory.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor to Category Mapping", 14, 10);
    autoTable(doc, {
      startY: 15,
      head: [
        [
          "Media ID",
          "Media Type",
          "Vendor ID",
          "Vendor Name",
          "Category ID",
          "Category Text",
        ],
      ],
      body: currentRows.map((item) => [
        item.media_type_id,
        item.media_type,
        item.vendor_id,
        item.vendor_name,
        item.cate_id,
        item.cate_text,
      ]),
    });
    doc.save("MapVendorCategory.pdf");
  };

  return (
    <div className="container mt-4">
     {alert.show && (
  <div
    className={`position-fixed top-50 start-50 translate-middle alert alert-${alert.type} text-center border border-2 shadow`}
    style={{ zIndex: 1055, minWidth: "300px" }}
    role="alert"
  >
    <strong>{alert.message}</strong>
  </div>
)}

      {/* Form */}
      <div ref={formRef} className="mb-4">
        <form onSubmit={handleSubmit}>
          <div className="border p-3 rounded">
            <h5 className="text-center mb-4 fw-bold bg-primary-subtle p-2">
              Map Vendor to Category
            </h5>
            <div className="row mb-2">
              {[
                { name: "media_type_id", label: "Media Type ID" },
                { name: "media_type", label: "Media Type" },
                { name: "vendor_id", label: "Vendor ID" },
                { name: "vendor_name", label: "Vendor Name" },
                { name: "cate_id", label: "Category ID" },
                { name: "cate_text", label: "Category Text" },
              ].map(({ name, label }, idx) => (
                <div className="col-md-4" key={idx}>
                  <label>{label}</label>
                  <input
                    type="text"
                    name={name}
                    className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors[name]}</div>
                </div>
              ))}
            </div>

            <div className="d-flex gap-2 justify-content-center">
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

      {/* Table + Export */}
      <div className="fw-bold bg-danger-subtle p-2 mb-3">
        <h5 className="text-center">Vendor to Category Mapping List</h5>
      </div>
      <div className="d-flex justify-content-end mb-2">
        <button onClick={exportExcel} className="btn btn-success btn-sm me-2">
          Export Excel
        </button>
        <button onClick={exportPDF} className="btn btn-danger btn-sm">
          Export PDF
        </button>
      </div>

      <table className="table table-bordered text-center">
        <thead className="text-white bg-dark">
          <tr>
            <th>Media Type ID</th>
            <th>Media Type</th>
            <th>Vendor ID</th>
            <th>Vendor Name</th>
            <th>Category ID</th>
            <th>Category Text</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((item) => (
            <tr key={`${item.media_type_id}_${item.vendor_id}_${item.cate_id}`}>
              <td>{item.media_type_id}</td>
              <td>{item.media_type}</td>
              <td>{item.vendor_id}</td>
              <td>{item.vendor_name}</td>
              <td>{item.cate_id}</td>
              <td>{item.cate_text}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  type="button"
                  onClick={() => handleEdit(item)}
                >
                  Edit
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
              <button className="page-link" onClick={() => setCurrentPage(1)}>
                First
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                Last
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MapVendorCategory;
