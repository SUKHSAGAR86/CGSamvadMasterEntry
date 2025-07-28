import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Form, Table, Alert, Card, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProductionType = () => {
  const [formData, setFormData] = useState({
    production_type: "",
    status: "",
    display_order: "",
  });

  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const alertRef = useRef();

  const formRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3080/api/productiontype/get-productiontype"
      );
      setList(res.data);
    } catch {
      showAlert("Failed to fetch production types", "danger");
    }
  };

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { production_type, status, display_order } = formData;

    if (!production_type || !status || !display_order) {
      showAlert("All fields are required", "warning");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3080/api/productiontype/update-productiontype/${editId}`,
          { ...formData, production_type_id: editId }
        );
        showAlert("Production type updated successfully");
      } else {
        await axios.post(
          "http://localhost:3080/api/productiontype/add-productiontype",
          formData
        );
        showAlert("Production type added successfully");
      }

      fetchData();
      setFormData({ production_type: "", status: "", display_order: "" });
      setEditId(null);
    } catch (err) {
      showAlert(err.response?.data || "Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      production_type: item.production_type,
      status: item.status,
      display_order: item.display_order,
    });
    setEditId(item.production_type_id);

    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExportExcel = () => {
    const data = list.map((item) => ({
      ID: item.production_type_id,
      "Production Type": item.production_type,
      Status: item.status === "1" ? "Active" : "Inactive",
      "Display Order": item.display_order,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProductionType");
    XLSX.writeFile(wb, "ProductionType.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Production Type", "Status", "Display Order"]],
      body: list.map((item) => [
        item.production_type_id,
        item.production_type,
        item.status === "1" ? "Active" : "Inactive",
        item.display_order,
      ]),
    });
    doc.save("ProductionType.pdf");
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRows = list.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(list.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <h4 className="text-center mb-4 bg-success-subtle p-2">
        Production Type Master
      </h4>

      {alert.show && (
        <div
          ref={alertRef}
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: "40%",
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          <Alert variant={alert.variant} className="text-center w-50">
            {alert.message}
          </Alert>
        </div>
      )}

      <Card className="mb-4 shadow-sm" ref={formRef}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              {editId && (
                <Col md={2}>
                  <Form.Label>ID</Form.Label>
                  <Form.Control type="text" value={editId} readOnly />
                </Col>
              )}
              <Col md={editId ? 4 : 6}>
                <Form.Label>Production Type</Form.Label>
                <Form.Control
                  type="text"
                  name="production_type"
                  value={formData.production_type}
                  onChange={handleChange}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">----Select----</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label>Display Order</Form.Label>
                <Form.Control
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button type="submit" variant="primary">
                {editId ? "Update" : "Submit"}
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={() => {
                  setFormData({
                    production_type: "",
                    status: "",
                    display_order: "",
                  });
                  setEditId(null);
                }}
              >
                Clear
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <hr />
      <h5 className="text-center fw-bold bg-danger-subtle p-2 mt-4">
        Production Type List
      </h5>
      <div className="d-flex justify-content-end mb-2 gap-2">
        <Button variant="success" size="sm" onClick={handleExportExcel}>
          Export Excel
        </Button>
        <Button variant="danger" size="sm" onClick={handleExportPDF}>
          Export PDF
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="text-center">
          <tr>
            <th className="bg-dark text-white">ID</th>
            <th className="bg-dark text-white">Production Type</th>
            <th className="bg-dark text-white">Status</th>
            <th className="bg-dark text-white">Display Order</th>
            <th className="bg-dark text-white">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentRows.map((item) => (
            <tr key={item.production_type_id}>
              <td>{item.production_type_id}</td>
              <td>{item.production_type}</td>
              <td>
                <span
                  className={`badge rounded-pill px-3 py-2 fw-semibold ${
                    item.status === "1" ? "bg-success" : "bg-secondary"
                  } text-white`}
                >
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{item.display_order}</td>
              <td>
                <div
                  onClick={() => handleEdit(item)}
                  className="btn btn-warning text-dark bi-pencil-fill"
                >
                  Edit
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next
              </button>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProductionType;
