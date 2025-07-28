import { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Table,
  Card,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RateType = () => {
  const [formData, setFormData] = useState({
    rate_type: "",
    status: "",
  });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [touched, setTouched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/ratetype/get-ratetype");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const { rate_type, status } = formData;

    if (
      !rate_type ||
      !/^[A-Za-z]/.test(rate_type) ||
      !status
    ) {
      showAlert("All fields are required and must start with an alphabet", "danger");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3080/api/ratetype/update-ratetype/${editId}`,
          formData
        );
        showAlert("Updated successfully");
      } else {
        await axios.post(
          "http://localhost:3080/api/ratetype/add-ratetype",
          formData
        );
        showAlert("Created successfully");
      }
      setFormData({ rate_type: "", status: "" });
      setEditId(null);
      setTouched(false);
      fetchData();
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      rate_type: item.rate_type,
      status: item.status,
    });
    setEditId(item.rate_type_id);
    setTouched(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RateType");
    XLSX.writeFile(wb, "RateType.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Rate Type", "Status"]],
      body: data.map((item) => [
        item.rate_type_id,
        item.rate_type,
        item.status === "1" ? "Active" : "Inactive",
      ]),
    });
    doc.save("RateType.pdf");
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">
        Rate Type Master
      </h4>

      {alert.show && (
        <Alert
          variant={alert.variant}
          className="text-center position-fixed top-50 start-50 translate-middle z-3 w-50 shadow"
        >
          {alert.message}
        </Alert>
      )}

      <Card className="p-3 mb-4 shadow">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Rate Type</Form.Label>
                <Form.Control
                  name="rate_type"
                  value={formData.rate_type}
                  onChange={handleChange}
                  className={
                    touched &&
                    (!formData.rate_type ||
                      !/^[A-Za-z]/.test(formData.rate_type))
                      ? "is-invalid"
                      : ""
                  }
                />
                {touched &&
                  (!formData.rate_type ||
                    !/^[A-Za-z]/.test(formData.rate_type)) && (
                    <div className="invalid-feedback d-block">
                      Must start with an alphabet and cannot be empty.
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={
                    touched && !formData.status ? "is-invalid" : ""
                  }
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Select>
                {touched && !formData.status && (
                  <div className="invalid-feedback d-block">
                    Please select a status.
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end mt-3">
            {editId ? (
              <>
                <Button type="submit" variant="primary" className="me-2">
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({ rate_type: "", status: "" });
                    setEditId(null);
                    setTouched(false);
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
                    setFormData({ rate_type: "", status: "" });
                    setTouched(false);
                  }}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card>

      <hr />

      <h4 className="text-center bg-danger-subtle p-2">
        Rate Type List
      </h4>

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
            <th className="bg-dark text-white">ID</th>
            <th className="bg-dark text-white">Rate Type</th>
            <th className="bg-dark text-white">Status</th>
            <th className="bg-dark text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.rate_type_id}>
              <td>{item.rate_type_id}</td>
              <td>{item.rate_type}</td>
              <td>
                <span
                  className={`badge ${
                    item.status === "1" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <div
                  className="btn btn-warning text-dark fw-bold bi-pencil-fill"
                  onClick={() => handleEdit(item)}
                >&nbsp;
                  Edit
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mb-5">
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
          Next         </Button>
      </div>
    </div>
  );
};

export default RateType;
