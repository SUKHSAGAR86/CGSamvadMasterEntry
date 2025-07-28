import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MapWorkTypeMediaType = () => {
  const initialFormState = {
    work_type_id: "",
    work_type: "",
    media_type_id: "",
    media_type: "",
    rate_calculation_on_id: "",
    rate_calculation_on_E: "",
    rate_calculation_on_H: "",
    calculate_commission: "",
    ro_amt_convert_in_100_percent: "",
    display_as: "",
    discount_percent_on_wo_amt: "",
    it_tds_on_wo_amt: "",
    status: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const formRef = useRef(null);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/mapworktypemediatype/get-mapworktypemediatype");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

const validate = () => {
  const newErrors = {};
  if (!formData.work_type_id) {
    newErrors.work_type_id = "Required";
  } else if (!/^\d+$/.test(formData.work_type_id)) {
    newErrors.work_type_id = "Must be numbers only";
  }

  if (!formData.media_type_id) {
    newErrors.media_type_id = "Required";
  } else if (!/^\d+$/.test(formData.media_type_id)) {
    newErrors.media_type_id = "Must be numbers only";
  }

  if (!formData.work_type) {
    newErrors.work_type = "Required";
  } else if (!/^[A-Za-z].*$/.test(formData.work_type)) {
    newErrors.work_type = "Must start with a Alphabet";
  }

  if (!formData.rate_calculation_on_id) {
    newErrors.rate_calculation_on_id = "Required";
  } else if (!/^\d+$/.test(formData.rate_calculation_on_id)) {
    newErrors.rate_calculation_on_id = "Must be numbers only";
  }

  if (!formData.rate_calculation_on_E) {
    newErrors.rate_calculation_on_E = "Required";
  } else if (!/^[A-Za-z].*$/.test(formData.rate_calculation_on_E)) {
    newErrors.rate_calculation_on_E = "Must start with a Alphabet";
  }

  if (!formData.rate_calculation_on_H) {
    newErrors.rate_calculation_on_H = "Required";
  } else if (!/^[\u0900-\u097F\s]+$/.test(formData.rate_calculation_on_H)) {
    newErrors.rate_calculation_on_H = "Only Hindi characters allowed";
  }

  if (!formData.media_type) {
    newErrors.media_type = "Required";
  } else if (!/^[A-Za-z].*$/.test(formData.media_type)) {
    newErrors.media_type = "Must start with a Alphabet";
  }

  if (!formData.status) newErrors.status = "Required";

  if (!formData.calculate_commission) newErrors.calculate_commission = "Required";

  if (!formData.ro_amt_convert_in_100_percent) newErrors.ro_amt_convert_in_100_percent = "Required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) {
    showAlert("Invalid entry", "danger");
    return;
  }

  const payload = {
    ...formData,
    discount_percent_on_wo_amt: formData.discount_percent_on_wo_amt
      ? parseFloat(formData.discount_percent_on_wo_amt)
      : null,
    it_tds_on_wo_amt: formData.it_tds_on_wo_amt
      ? parseFloat(formData.it_tds_on_wo_amt)
      : null,
  };

  try {
    if (editId) {
      await axios.put(
  `http://localhost:3080/api/mapworktypemediatype/update-mapworktypemediatype/${editId}/${formData.old_media_type_id}`,
  formData
);
      showAlert("Updated successfully");
    } else {
      await axios.post(
        "http://localhost:3080/api/mapworktypemediatype/add-mapworktypemediatype",
        payload
      );
      showAlert("Created successfully");
    }

    fetchData();
    setFormData(initialFormState);
    setErrors({});
    setEditId(null);
  } catch (err) {
    showAlert("Error occurred", "danger");
  }
};


  const handleEdit = (item) => {
  setFormData({ ...item, old_media_type_id: item.media_type_id }); //  add this
  setEditId(item.work_type_id);
  window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
};

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" });
    XLSX.utils.sheet_add_aoa(ws, [["WorkType MediaType Mapping"]], { origin: "A1" });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, " WorkType to MediaType");
    XLSX.writeFile(wb, "WorkType_MediaType_Mapping.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`WorkType-MediaType- Page ${currentPage}`, 14, 15);
    const currentPageData = paginatedData.map((item) => [
      item.work_type_id,
      item.work_type,
      item.media_type,
      item.status === "1" ? "Active" : "Inactive",
    ]);
    autoTable(doc, {
      startY: 20,
      head: [["ID", "Work Type", "Media Type", "Status"]],
      body: currentPageData,
    });
    doc.save(`Mapping_Page${currentPage}.pdf`);
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Map WorkType to MediaType</h4>
      {alert.show && (
        <Alert variant={alert.variant} className="text-center position-fixed top-50 start-50 translate-middle z-3 w-50 shadow">
          {alert.message}
        </Alert>
      )}
      <Card className="p-3 mb-4 shadow" ref={formRef}>
        <Form onSubmit={handleSubmit}>
          <Row>
            {["work_type_id", "work_type", "media_type_id", "media_type", "rate_calculation_on_id", "rate_calculation_on_E", "rate_calculation_on_H", "display_as", "discount_percent_on_wo_amt", "it_tds_on_wo_amt"].map((field, idx) => (
              <Col md={4} key={idx} className="mb-3">
                <Form.Group>
                  <Form.Label className="text-capitalize">{field.replaceAll("_", " ")}</Form.Label>
                  <Form.Control
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    isInvalid={!!errors[field]}
                  />
                  {errors[field] && <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            ))}
            {["calculate_commission", "ro_amt_convert_in_100_percent"].map((field) => (
              <Col md={4} key={field} className="mb-3">
                <Form.Group>
                  <Form.Label className="text-capitalize">{field.replaceAll("_", " ")}</Form.Label>
                  <Form.Select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    isInvalid={!!errors[field]}
                  >
                    <option value="">Select</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </Form.Select>
                  {errors[field] && <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            ))}
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  isInvalid={!!errors.status}
                >
                  <option value="">Select</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Select>
                {errors.status && (
                  <Form.Control.Feedback type="invalid">
                    {errors.status}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end">
            {editId ? (
              <>
                <Button type="submit" variant="primary" className="me-2">Update</Button>
                <Button variant="danger" onClick={() => { setFormData(initialFormState); setEditId(null); setErrors({}); }}>Cancel</Button>
              </>
            ) : (
              <>
                <Button type="submit" variant="primary" className="me-2">Submit</Button>
                <Button variant="danger" onClick={() => { setFormData(initialFormState); setErrors({}); }}>Clear</Button>
              </>
            )}
          </div>
        </Form>
      </Card>

      <hr className="text-danger" />
      <h4 className="bg-danger-subtle p-2 text-center"> WorkType to MediaType List</h4>
      <div className="d-flex justify-content-between mb-2">
        <div>
          <Button variant="success" className="me-2" onClick={exportToExcel}>Export Excel</Button>
          <Button variant="danger" onClick={exportToPDF}>Export PDF</Button>
        </div>
        <div>
          <strong>Page {currentPage} of {totalPages}</strong>
        </div>
      </div>

      <Table striped bordered hover responsive className="shadow text-center">
        <thead>
          <tr>
            <th className="bg-dark text-white fw-bold">Work Type ID</th>
            <th className="bg-dark text-white fw-bold">Media Type ID</th>
            <th className="bg-dark text-white fw-bold">Work Type</th>
            <th className="bg-dark text-white fw-bold">Media Type</th>
            <th className="bg-dark text-white fw-bold">Rate Calculation English </th>
            <th className="bg-dark text-white fw-bold">Rate Calculation Hindi </th>
            <th className="bg-dark text-white fw-bold">Rate Calculation ID</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.work_type_id}</td>
                 <td>{item.media_type_id}</td>
              <td>{item.work_type}</td>
              <td>{item.media_type}</td>
                   <td>{item.rate_calculation_on_E}</td>
                        <td>{item.rate_calculation_on_H}</td>
                        <td>{item.rate_calculation_on_id}</td>
              <td>
                <span className={`badge ${item.status === "1" ? "bg-success" : "bg-secondary"}`}>
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mb-4">
        <Button variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="me-2">Prev</Button>
        <Button variant="secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default MapWorkTypeMediaType;
