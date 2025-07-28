import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const VendorCategory = () => {
  const [formData, setFormData] = useState({ cate_text: "", status: "" });
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const formRef = useRef(null);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/vendorcategory/get-vendorcategory");
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
    if (!formData.cate_text.trim()) {
      newErrors.cate_text = "Required";
    } else if (!/^[A-Za-z][A-Za-z ]*$/.test(formData.cate_text.trim())) {
      newErrors.cate_text = "Only alphabets allowed. No number/special character at start.";
    }

    if (formData.status !== "0" && formData.status !== "1") {
      newErrors.status = "Status must be 0 or 1";
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
      showAlert("Validation errors exist", "danger");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3080/api/vendorcategory/update-vendorcategory/${editId}`,
          formData
        );
        showAlert("Updated successfully");
      } else {
        await axios.post(
          "http://localhost:3080/api/vendorcategory/add-vendorcategory",
          formData
        );
        showAlert("Created successfully");
      }

      fetchData();
      setFormData({ cate_text: "", status: "" });
      setErrors({});
      setEditId(null);
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({ cate_text: item.cate_text, status: item.status });
    setEditId(item.cate_id);
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const exportToExcel = () => {
    const wsData = [
      ["Vendor Category Master - Current Page"],
      [],
      ["Category ID", "Category Text", "Status"],
      ...paginatedData.map((item) => [
        item.cate_id,
        item.cate_text,
        item.status === "1" ? "Active" : "Inactive",
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VendorCategory");
    XLSX.writeFile(wb, "VendorCategory_CurrentPage.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Vendor Category Page  ${currentPage}`, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Category ID", "Category Text", "Status"]],
      body: paginatedData.map((item) => [
        item.cate_id,
        item.cate_text,
        item.status === "1" ? "Active" : "Inactive",
      ]),
    });
    doc.save("VendorCategory_CurrentPage.pdf");
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Vendor Category Master</h4>

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
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="cate_text"
                  value={formData.cate_text}
                  onChange={handleChange}
                  isInvalid={!!errors.cate_text}
                  placeholder="Enter category name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cate_text}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  isInvalid={!!errors.status}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.status}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end">
            {editId ? (
              <>
                <Button type="submit" variant="primary" className="me-2">Update</Button>
                <Button variant="danger" onClick={() => {
                  setFormData({ cate_text: "", status: "" });
                  setEditId(null);
                  setErrors({});
                }}>Cancel</Button>
              </>
            ) : (
              <>
                <Button type="submit" variant="primary" className="me-2">Submit</Button>
                <Button variant="danger" onClick={() => {
                  setFormData({ cate_text: "", status: "" });
                  setErrors({});
                }}>Clear</Button>
              </>
            )}
          </div>
        </Form>
      </Card>

      <hr className="text-danger"/>
<h4 className="text-center bg-danger-subtle p-2 mt-4 mb-3">Vendor Category List</h4>
      <div className="d-flex justify-content-between mb-2">
        
        <div> <strong>Page {currentPage} of {totalPages}</strong></div>
        <div>
          <Button variant="success" className="me-2" onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button variant="danger" onClick={exportToPDF}>
            Export PDF
          </Button>
        </div>
        
      </div>

      <Table striped bordered hover responsive className="shadow text-center">
        <thead>
          <tr>
            <th className="bg-dark text-white fw-bold">Category ID</th>
            <th className="bg-dark text-white fw-bold">Category</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead> 
        <tbody>
          {paginatedData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.cate_id}</td>
              <td>{item.cate_text}</td>
              <td>
                <span className={`badge ${item.status === "1" ? "bg-success" : "bg-secondary"}`}>
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(item)}className="bi-pencil-fill">
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <hr className="text-danger"/>
      <div className="d-flex justify-content-end mb-4">
         
          <Button
            variant="secondary"
            className="ms-3 me-1"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
    </div>
  );
};

export default VendorCategory;
