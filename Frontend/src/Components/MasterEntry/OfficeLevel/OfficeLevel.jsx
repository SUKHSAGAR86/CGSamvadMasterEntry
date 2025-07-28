
import React, { useEffect, useState } from "react";
import axios from "axios";
import {Container,Row,Col,Form,Button,Table,Modal,Spinner,} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const initialForm = {
  OfficeLevelCode: "",
  CountryCode: "",
  StateCode: "",
  BaseDeptCode: "",
  OfficeLevelName: "",
  DisplayOrder: "",
  flag: 1,
};

const OfficeLevel = () => {
  const [formData, setFormData] = useState(initialForm);
  const [officeLevels, setOfficeLevels] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/officelevels");
      setOfficeLevels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 900);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0];

    const payload = {
      ...formData,
      ...(editMode
        ? { modify_date: date, modify_time: time }
        : { entry_date: date, entry_time: time }),
    };

    try {
      setLoading(true);
      if (editMode) {
        await axios.put(
          `http://localhost:3080/api/officelevel/${formData.OfficeLevelCode}`,
          payload
        );
        showAlert("Office Level Updated Successfully!");
      } else {
        await axios.post("http://localhost:3080/api/officelevel", payload);
        showAlert("Office Level Created Successfully!");
      }
      setFormData(initialForm);
      setEditMode(false);
      fetchData();
    } catch (err) {
      showAlert("Error: " + err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (code) => {
    try {
      const res = await axios.get(
        `http://localhost:3080/api/officelevel/${code}`
      );
      setFormData(res.data);
      setEditMode(true);
      window.scrollTo(0, 0);
    } catch (err) {
      showAlert("Failed to fetch record.", "danger");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center text-primary mb-4">Office Level</h2>

      {alert.show && (
        <Modal show centered>
          <Modal.Body
            className="text-center fw-bold text-white"
            style={{
              backgroundColor:
                alert.type === "success" ? "#28a745" : "#dc3545",
              fontSize: "1.2rem",
            }}
          >
            {alert.message}
          </Modal.Body>
        </Modal>
      )}

      <Form onSubmit={handleSubmit} className="border rounded p-4 shadow-sm">
        <Row className="mb-3">
          <Col md={3}>
            <Form.Label>Office Level Code<span className="text-danger fw-bold">*</span></Form.Label>
            <Form.Control
              type="text"
              name="OfficeLevelCode"
              value={formData.OfficeLevelCode}
              onChange={handleChange}
              maxLength={2}
              disabled={editMode}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Label>Country Code<span className="text-danger fw-bold">*</span></Form.Label>
            <Form.Control
              type="text"
              name="CountryCode"
              value={formData.CountryCode}
              onChange={handleChange}
              maxLength={3}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Label>State Code<span className="text-danger fw-bold">*</span></Form.Label>
            <Form.Control
              type="text"
              name="StateCode"
              value={formData.StateCode}
              onChange={handleChange}
              maxLength={3}
              required
           
            />
          </Col>
          <Col md={3}>
            <Form.Label>Base Dept Code<span className="text-danger fw-bold">*</span></Form.Label>
            <Form.Control
              type="text"
              name="BaseDeptCode"
              value={formData.BaseDeptCode}
              onChange={handleChange}
              maxLength={4}
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Office Level Name<span className="text-danger fw-bold">*</span></Form.Label>
            <Form.Control
              type="text"
              name="OfficeLevelName"
              value={formData.OfficeLevelName}
              onChange={handleChange}
              maxLength={50}
              required
           
            />
          </Col>
          <Col md={3}>
            <Form.Label>Display Order<span className="text-danger fw-bold">*</span></Form.Label>
            <Form.Control
              type="number"
              name="DisplayOrder"
              value={formData.DisplayOrder}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Label>Flag</Form.Label>
            <Form.Control
              type="number"
              name="flag"
              value={formData.flag}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : editMode ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Form>

      <hr className="my-4" />

      <h5 className="text-secondary">All Office Levels</h5>
      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>Code</th>
            <th>Country</th>
            <th>State</th>
            <th>Base Dept</th>
            <th>Name</th>
            <th>Order</th>
            <th>Flag</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {officeLevels.map((item) => (
            <tr key={item.OfficeLevelCode}>
              <td>{item.OfficeLevelCode}</td>
              <td>{item.CountryCode}</td>
              <td>{item.StateCode}</td>
              <td>{item.BaseDeptCode}</td>
              <td>{item.OfficeLevelName}</td>
              <td>{item.DisplayOrder}</td>
              <td>{item.flag}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="bi-pencil-fill fw-bold"
                  onClick={() => handleEdit(item.OfficeLevelCode)}
                >
                  &nbsp;Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OfficeLevel;
