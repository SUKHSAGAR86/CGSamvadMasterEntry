import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const WorkType = () => {
  const [formData, setFormData] = useState({ work_type: "", accronym: "", status: "" });
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
      const res = await axios.get("http://localhost:3080/api/worktype/get-worktype");
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
    if (!formData.work_type) {
      newErrors.work_type = "Required";
    } else if (!/^[A-Za-z].*$/.test(formData.work_type)) {
      newErrors.work_type = "Must start with a letter";
    }
    if (!formData.accronym) {
      newErrors.accronym = "Required";
    }
    else if (!/^[A-Za-z].*$/.test(formData.accronym)) {
      newErrors.accronym = "Must start with a letter";
    }
    if (!formData.status) {
      newErrors.status = "Required";
    }
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
      if (editId) {
        await axios.put(
          `http://localhost:3080/api/worktype/update-worktype/${editId}`,
          formData
        );
        showAlert("Updated successfully");
      } else {
        const res = await axios.post(
          "http://localhost:3080/api/worktype/add-worktype",
          formData
        );
        showAlert(res.data);
      }
      fetchData();
      setFormData({ work_type: "", accronym: "", status: "" });
      setErrors({});
      setEditId(null);
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({ work_type: item.work_type, accronym: item.accronym, status: item.status });
    setEditId(item.work_type_id);
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" });
    XLSX.utils.sheet_add_aoa(ws, [["Work Type Master"]], { origin: "A1" });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WorkType");
    XLSX.writeFile(wb, "WorkType.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Work Type List - Page ${currentPage}`, 14, 15);
    const currentPageData = paginatedData.map((item) => [
      item.work_type_id,
      item.work_type,
      item.accronym,
      item.status === "1" ? "Active" : "Inactive",
    ]);
    autoTable(doc, {
      startY: 20,
      head: [["ID", "Work Type", "Accronym", "Status"]],
      body: currentPageData,
    });
    doc.save(`WorkType_Page${currentPage}.pdf`);
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Work Type Master</h4>
      {alert.show && (
        <Alert
          variant={alert.variant}
          className="text-center position-fixed top-50 start-50 translate-middle z-3 w-50 shadow"
        >
          {alert.message}
        </Alert>
      )}
      <Card className="p-3 mb-4 shadow" ref={formRef}>
        <Form onSubmit={handleSubmit}>
          <Row>
            {["work_type", "accronym", "status"].map((field, idx) => (
              <Col md={4} key={idx} className="mb-3">
                <Form.Group>
                  <Form.Label className="text-capitalize">
                    {field.replaceAll("_", " ")}
                  </Form.Label>
                  {field === "status" ? (
                    <Form.Control
                      as="select"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      isInvalid={!!errors[field]}
                    >
                      <option value="">Select</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </Form.Control>
                  ) : (
                    <Form.Control
                      type="text"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      isInvalid={!!errors[field]}
                    />
                  )}
                  {errors[field] && (
                    <Form.Control.Feedback type="invalid">
                      {errors[field]}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
          <div className="text-end">
            {editId ? (
              <>
                <Button type="submit" variant="primary" className="me-2">
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({ work_type: "", accronym: "", status: "" });
                    setEditId(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" variant="primary" className="me-2">
                  Submit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({ work_type: "", accronym: "", status: "" });
                    setErrors({});
                  }}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card>

      <hr className="text-danger" />
      <h4 className="bg-danger-subtle p-2 text-center">Work Type List</h4>
      <div className="d-flex justify-content-between mb-2">
        <div>
          <Button variant="success" className="me-2" onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button variant="danger" onClick={exportToPDF}>
            Export PDF
          </Button>
        </div>
        <div>
          <strong>
            Page {currentPage} of {totalPages}
          </strong>
        </div>
      </div>

      <Table striped bordered hover responsive className="shadow text-center">
        <thead>
          <tr>
            <th className="bg-dark text-white fw-bold">ID</th>
            <th className="bg-dark text-white fw-bold">Work Type</th>
            <th className="bg-dark text-white fw-bold">Accronym</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.work_type_id}</td>
              <td>{item.work_type}</td>
              <td>{item.accronym}</td>
              <td>
                <span
                  className={`badge ${item.status === "1" ? "bg-success" : "bg-secondary"}`}
                >
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(item)} className="bi-pencil-fill">
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mb-4">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="me-2"
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WorkType;
