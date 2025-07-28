import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const VendorSearchCategory = () => {
  const [formData, setFormData] = useState({ cate_name: "", status: "" });
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
      const res = await axios.get("http://localhost:3080/api/vendorsearchcategory/get-vendorsearchcategory");
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
    if (!formData.cate_name) {
      newErrors.cate_name = "Required";
    } else if (!/^[A-Za-z][A-Za-z0-9\s\W]*$/.test(formData.cate_name)) {
      newErrors.cate_name = "Must start with an alphabet character";
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
      if (editId) {
        await axios.put(
          `http://localhost:3080/api/vendorsearchcategory/update-vendorsearchcategory/${editId}`,
          formData
        );
        showAlert("Updated successfully");
      } else {
        const res = await axios.post(
          "http://localhost:3080/api/vendorsearchcategory/add-vendorsearchcategory",
          formData
        );
        showAlert(res.data);
      }
      fetchData();
      setFormData({ cate_name: "", status: "" });
      setErrors({});
      setEditId(null);
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({ cate_name: item.cate_name, status: item.status });
    setEditId(item.cate_id);
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" });
    XLSX.utils.sheet_add_aoa(ws, [["Vendor Search Category"]], { origin: "A1" });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VendorSearchCategory");
    XLSX.writeFile(wb, "VendorSearchCategory.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Vendor Search Category - Page ${currentPage}`, 14, 15);
    const currentPageData = paginatedData.map((item) => [
      item.cate_id,
      item.cate_name,
      item.status === "1" ? "Active" : "Inactive",
    ]);
    autoTable(doc, {
      startY: 20,
      head: [["ID", "Category Name", "Status"]],
      body: currentPageData,
    });
    doc.save(`VendorSearchCategory_Page${currentPage}.pdf`);
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Vendor Search Category</h4>
      {alert.show && (
        <Alert variant={alert.variant} className="text-center position-fixed top-50 start-50 translate-middle z-3 w-50 shadow">
          {alert.message}
        </Alert>
      )}
      <Card className="p-3 mb-4 shadow" ref={formRef}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  name="cate_name"
                  value={formData.cate_name}
                  onChange={handleChange}
                  isInvalid={!!errors.cate_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cate_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  isInvalid={!!errors.status}
                >
                  <option value="">Select</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Control>
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
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({ cate_name: "", status: "" });
                    setEditId(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" variant="primary" className="me-2">Submit</Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({ cate_name: "", status: "" });
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
      <h4 className="bg-danger-subtle p-2 text-center">Category List</h4>
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
          <strong>Page {currentPage} of {totalPages}</strong>
        </div>
      </div>

      <Table striped bordered hover responsive className="shadow text-center">
        <thead>
          <tr>
            <th className="bg-dark text-white fw-bold">ID</th>
            <th className="bg-dark text-white fw-bold">Category Name</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.cate_id}</td>
              <td>{item.cate_name}</td>
              <td>
                <span className={`badge ${item.status === "1" ? "bg-success" : "bg-secondary"}`}>
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

      <div className="d-flex justify-content-end">
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

export default VendorSearchCategory;
