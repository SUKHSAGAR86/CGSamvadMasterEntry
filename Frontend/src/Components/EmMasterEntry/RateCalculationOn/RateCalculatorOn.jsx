

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Table,
  Card,
  Row,
  Col,
  Modal,
  Alert,
} from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RateCalculationOn = () => {
  const [formData, setFormData] = useState({
    rate_calculation_on_E: "",
    rate_calculation_on_H: "",
    status: "",
  });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [touched, setTouched] = useState(false);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3080/api/ratecalculationon/get-ratecalculationon"
      );
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

    const { rate_calculation_on_E, rate_calculation_on_H, status } = formData;
    const startsWithLetter = /^[A-Za-z]/;

    if (
      !rate_calculation_on_E ||
      !rate_calculation_on_H ||
      !status ||
      !startsWithLetter.test(rate_calculation_on_E) ||
      !startsWithLetter.test(rate_calculation_on_H)
    ) {
      showAlert("Please correct the errors before submitting.", "danger");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3080/api/ratecalculationon/update-ratecalculationon/${editId}`,
          formData
        );
        showAlert("Updated successfully");
      } else {
        await axios.post(
          "http://localhost:3080/api/ratecalculationon/add-ratecalculationon",
          formData
        );
        showAlert("Created successfully");
      }
      setFormData({
        rate_calculation_on_E: "",
        rate_calculation_on_H: "",
        status: "",
      });
      setEditId(null);
      setTouched(false);
      fetchData();
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      rate_calculation_on_E: item.rate_calculation_on_E,
      rate_calculation_on_H: item.rate_calculation_on_H,
      status: item.status,
    });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RateCalculationOn");
    XLSX.writeFile(wb, "RateCalculationOn.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Rate Calculation E", "Rate Calculation H", "Status"]],
      body: data.map((item) => [
        item.id,
        item.rate_calculation_on_E,
        item.rate_calculation_on_H,
        item.status,
      ]),
    });
    doc.save("RateCalculationOn.pdf");
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">
        Rate Calculation On Master
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
            <Col md={4}>
              <Form.Group>
                <Form.Label>Rate Calculation On (E)</Form.Label>
                <Form.Control
                  name="rate_calculation_on_E"
                  value={formData.rate_calculation_on_E}
                  onChange={handleChange}
                  className={
                    touched &&
                    (!formData.rate_calculation_on_E ||
                      !/^[A-Za-z]/.test(formData.rate_calculation_on_E))
                      ? "is-invalid"
                      : ""
                  }
                />
                {touched &&
                  (!formData.rate_calculation_on_E ||
                    !/^[A-Za-z]/.test(formData.rate_calculation_on_E)) && (
                    <div className="invalid-feedback d-block">
                      Must start with an alphabet and cannot be empty.
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Rate Calculation On (H)</Form.Label>
                <Form.Control
                  name="rate_calculation_on_H"
                  value={formData.rate_calculation_on_H}
                  onChange={handleChange}
                  className={
                    touched &&
                    (!formData.rate_calculation_on_H ||
                      !/^[A-Za-z]/.test(formData.rate_calculation_on_H))
                      ? "is-invalid"
                      : ""
                  }
                />
                {touched &&
                  (!formData.rate_calculation_on_H ||
                    !/^[A-Za-z]/.test(formData.rate_calculation_on_H)) && (
                    <div className="invalid-feedback d-block">
                      Must start with an alphabet and cannot be empty.
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={touched && !formData.status ? "is-invalid" : ""}
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
                    setFormData({
                      rate_calculation_on_E: "",
                      rate_calculation_on_H: "",
                      status: "",
                    });
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
                    setFormData({
                      rate_calculation_on_E: "",
                      rate_calculation_on_H: "",
                      status: "",
                    });
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
        Rate Calculation On List
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
            <th className="bg-dark text-white fw-bold">ID</th>
            <th className="bg-dark text-white fw-bold">Rate Calc. (E)</th>
            <th className="bg-dark text-white fw-bold">Rate Calc. (H)</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.rate_calculation_on_E}</td>
              <td>{item.rate_calculation_on_H}</td>
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
                  className="btn btn-warning bi-pencil-fill text-dark fw-bold "
                  onClick={() => handleEdit(item)}
                >
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
          Next
        </Button>
      </div>
    </div>
  );
};

export default RateCalculationOn;
