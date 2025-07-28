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

const RateTypeFlag = () => {
  const [formData, setFormData] = useState({
    flag_id: "",
    flag: "",
    status: "",
  });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [touched, setTouched] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/ratetypeflag/get-ratetypeflag");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { flag_id, flag, status } = formData;
    if (!flag_id || !flag || !status || !/^[A-Za-z]/.test(flag)) {
      showAlert("Please fill all fields correctly", "danger");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:3080/api/ratetypeflag/update-ratetypeflag/${editId}`, formData);
        showAlert("Updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/ratetypeflag/add-ratetypeflag", formData);
        showAlert("Created successfully");
      }

      setFormData({ flag_id: "", flag: "", status: "" });
      setEditId(null);
      setTouched({});
      fetchData();
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      flag_id: item.flag_id,
      flag: item.flag,
      status: item.status,
    });
    setEditId(item.rate_type_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RateTypeFlag");
    XLSX.writeFile(wb, "RateTypeFlag.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Rate Tyep ID", "Flag ID", "Flag", "Status"]],
      body: data.map((item) => [
        item.rate_type_id,
        item.flag_id,
        item.flag,
        item.status,
      ]),
    });
    doc.save("RateTypeFlag.pdf");
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Rate Type Flag Master</h4>

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
                <Form.Label>Flag ID</Form.Label>
                <Form.Control
                  name="flag_id"
                  value={formData.flag_id}
                  onChange={handleChange}
                  type="number"
                  className={touched.flag_id && !formData.flag_id ? "is-invalid" : ""}
                />
                {touched.flag_id && !formData.flag_id && (
                  <div className="invalid-feedback d-block">Flag ID is required</div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Flag</Form.Label>
                <Form.Control
                  name="flag"
                  value={formData.flag}
                  onChange={handleChange}
                  className={touched.flag && (!formData.flag || !/^[A-Za-z]/.test(formData.flag)) ? "is-invalid" : ""}
                />
                {touched.flag &&
                  (!formData.flag || !/^[A-Za-z]/.test(formData.flag)) && (
                    <div className="invalid-feedback d-block">
                      Flag must start with an alphabet and not be empty
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
                  className={touched.status && !formData.status ? "is-invalid" : ""}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Select>
                {touched.status && !formData.status && (
                  <div className="invalid-feedback d-block">Status is required</div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end mt-3">
            {editId ? (
              <>
                <Button type="submit" variant="primary" className="me-2">Update</Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({ flag_id: "", flag: "", status: "" });
                    setEditId(null);
                    setTouched({});
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
                    setFormData({ flag_id: "", flag: "", status: "" });
                    setTouched({});
                  }}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card>
      <hr className="text-primary" />

      <h4 className="text-center bg-danger-subtle p-2">Rate Type Flag List</h4>

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
            <th className="bg-dark text-white">Rate_Type ID</th>
            <th className="bg-dark text-white">Flag ID</th>
            <th className="bg-dark text-white">Flag</th>
            <th className="bg-dark text-white">Status</th>
            <th className="bg-dark text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.rate_type_id}>
              <td>{item.rate_type_id}</td>
              <td>{item.flag_id}</td>
              <td>{item.flag}</td>
              <td>
                <span className={`badge ${item.status === "1" ? "bg-success" : "bg-secondary"}`}>
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(item)}>
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

export default RateTypeFlag;
