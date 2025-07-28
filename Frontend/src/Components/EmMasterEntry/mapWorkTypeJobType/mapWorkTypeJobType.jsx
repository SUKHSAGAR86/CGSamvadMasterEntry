import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MapWorkTypeJobType = () => {
  const initialFormState = {
    work_type_id: "",
    work_type: "",
    media_type_id: "",
    media_type: "",
    job_type_id: "",
    job_type_text: "",
    status: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [data, setData] = useState([]);
  const [editIds, setEditIds] = useState(null); // [work_type_id, old_job_type_id]
  const [errors, setErrors] = useState({});
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
      const res = await axios.get("http://localhost:3080/api/mapworktypejobtype/get-mapworktypejobtype");
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
    if (!formData.work_type_id) {newErrors.work_type_id = "Required";}
    else if (!/^\d+$/.test(formData.work_type_id)) {
    newErrors.work_type_id = "Must be numbers only";
  }

     if (!formData.work_type) {
    newErrors.work_type = "Required";
  } else if (!/^[A-Za-z].*$/.test(formData.work_type)) {
    newErrors.work_type = "Must start with a Alphabet";
  }

     if (!formData.media_type_id) {
    newErrors.media_type_id = "Required";
  } else if (!/^\d+$/.test(formData.media_type_id)) {
    newErrors.media_type_id = "Must be numbers only";
  }
     if (!formData.media_type) {
    newErrors.media_type = "Required";
  } else if (!/^[A-Za-z].*$/.test(formData.media_type)) {
    newErrors.media_type = "Must start with a Alphabet";
  }

    if (!formData.job_type_id){newErrors.job_type_id = "Required";}
    else if (!/^\d+$/.test(formData.job_type_id)) {
    newErrors.job_type_id = "Must be numbers only";
  }


    if (!formData.job_type_text){ newErrors.job_type_text = "Required";} 
    else if (!/^[A-Za-z].*$/.test(formData.job_type_text)) {
    newErrors.job_type_text = "Must start with a Alphabet";
  }
    if (!formData.status) newErrors.status = "Required";
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

    try {
      if (editIds) {
        const [work_type_id, old_job_type_id] = editIds;
        await axios.put(
          `http://localhost:3080/api/mapworktypejobtype/update-mapworktypejobtype/${work_type_id}/${old_job_type_id}`,
          formData
        );
        showAlert("Updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/mapworktypejobtype/add-mapworktypejobtype", formData);
        showAlert("Created successfully");
      }
      fetchData();
      setFormData(initialFormState);
      setErrors({});
      setEditIds(null);
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditIds([item.work_type_id, item.job_type_id]);
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" });
    XLSX.utils.sheet_add_aoa(ws, [["WorkType JobType Mapping"]], { origin: "A1" });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mapping");
    XLSX.writeFile(wb, "WorkType_JobType_Mapping.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`WorkType-JobType Mapping - Page ${currentPage}`, 14, 15);
    const currentPageData = paginatedData.map((item) => [
      item.work_type_id,
      item.work_type,
      item.media_type,
      item.job_type_id,
      item.job_type_text,
      item.status === "1" ? "Active" : "Inactive",
    ]);
    autoTable(doc, {
      startY: 20,
      head: [["Work Type ID", "Work Type", "Media Type", "Job Type ID", "Job Type", "Status"]],
      body: currentPageData,
    });
    doc.save(`Mapping_Page${currentPage}.pdf`);
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Map WorkType to JobType</h4>

      {alert.show && (
        <Alert variant={alert.variant} className="text-center position-fixed top-50 start-50 translate-middle z-3 w-50 shadow">
          {alert.message}
        </Alert>
      )}

      <Card className="p-3 mb-4 shadow" ref={formRef}>
        <Form onSubmit={handleSubmit}>
          <Row>
            {["work_type_id", "work_type", "media_type_id", "media_type", "job_type_id", "job_type_text"].map((field) => (
              <Col md={4} key={field} className="mb-3">
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
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={formData.status} onChange={handleChange} isInvalid={!!errors.status}>
                  <option value="">Select</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Select>
                {errors.status && <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end">
            {editIds ? (
              <>
                <Button type="submit" variant="primary" className="me-2">Update</Button>
                <Button variant="danger" onClick={() => { setFormData(initialFormState); setEditIds(null); setErrors({}); }}>Cancel</Button>
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
      <h4 className="bg-danger-subtle p-2 text-center">WorkType to JobType List</h4>
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
            <th className="bg-dark text-white">Work Type ID</th>
            <th className="bg-dark text-white">Work Type</th>
             <th className="bg-dark text-white">Media Type ID</th>
            <th className="bg-dark text-white">Media Type</th>
            <th className="bg-dark text-white">Job Type ID</th>
            <th className="bg-dark text-white">Job Type</th>
            <th className="bg-dark text-white">Status</th>
            <th className="bg-dark text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.work_type_id}</td>
              <td>{item.work_type}</td>
              <td>{item.media_type_id}</td>
              <td>{item.media_type}</td>
              <td>{item.job_type_id}</td>
              <td>{item.job_type_text}</td>
              <td>
                <span className={`badge ${item.status === "1" ? "bg-success" : "bg-secondary"}`}>
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(item)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mb-5">
        <Button variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="me-2">Prev</Button>
        <Button variant="secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default MapWorkTypeJobType;
