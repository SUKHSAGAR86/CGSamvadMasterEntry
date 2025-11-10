import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
} from "react-bootstrap";

function BaseDepartment() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    dept_id: "",
    dept_name: "",
    Commision_Percentage: "",
    discount_percent: "",
    flag: 1,
    DisplayOrder: "",
    Remark: "",
  });

  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const getDepartments = async () => {
    const res = await axios.get(
      "http://localhost:3080/api/basedepartment/get-basedepartment"
    );
    // const res = await axios.get("/api/basedepartment/get-basedepartment");

    setDepartments(res.data);
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.dept_id.trim()) newErrors.dept_id = "Department ID is required.";
    if (!form.dept_name.trim())
      newErrors.dept_name = "Department Name is required.";
    if (
      form.Commision_Percentage &&
      (form.Commision_Percentage < 0 || form.Commision_Percentage > 100)
    ) {
      newErrors.Commision_Percentage =
        "Commission % must be between 0 and 100.";
    }
    if (
      form.discount_percent &&
      (form.discount_percent < 0 || form.discount_percent > 100)
    ) {
      newErrors.discount_percent = "Discount % must be between 0 and 100.";
    }
    return newErrors;
  };

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "" });
    }, 3000);
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      if (editing) {
        await axios.put(
          `http://localhost:3080/api/basedepartment/update-basedepartment/${form.dept_id}`,
          form
        );
        showAlert("Department updated successfully!", "success");
      } else {
        await axios.post(
          "http://localhost:3080/api/basedepartment/add-basedepartment",
          form
        );
        showAlert("Department added successfully!", "success");
      }

      clearForm();
      setEditing(false);
      getDepartments();
    } catch (error) {
      showAlert("Error saving department.", "danger");
    }
  };

  const handleEdit = (dept) => {
    setForm(dept);
    setEditing(true);
    setErrors({});
  };

  const clearForm = () => {
    setForm({
      dept_id: "",
      dept_name: "",
      Commision_Percentage: "",
      discount_percent: "",
      flag: 1,
      DisplayOrder: "",
      Remark: "",
    });
    setErrors({});
  };

  const cancelEdit = () => {
    clearForm();
    setEditing(false);
  };

  return (
    <>
      {/* Alert Overlay */}
      {alert.show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className={`alert alert-${alert.variant} text-center shadow`}
            role="alert"
            style={{ minWidth: "300px", maxWidth: "400px" }}
          >
            <h5>{alert.variant === "success" ? "Success" : "Error"}</h5>
            <p className="mb-0">{alert.message}</p>
          </div>
        </div>
      )}

      <Container className="">
        <Card className="shadow">
          <Card.Body>
            <h5 className="text-center text-primary mb-5 fw-bold">
              Base Department
            </h5>
            <Row className="pe-4 ps-4">
              {/* <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Department ID <span className="text-danger fw-bold">*</span></Form.Label>
                  <Form.Control
                    name="dept_id"
                    value={form.dept_id}
                    onChange={handleChange}
                    disabled={editing}
                    isInvalid={!!errors.dept_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dept_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col> */}
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>
                    Department Name{" "}
                    <span className="text-danger fw-bold">*</span>
                  </Form.Label>
                  <Form.Control
                    name="dept_name"
                    value={form.dept_name}
                    onChange={handleChange}
                    isInvalid={!!errors.dept_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dept_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Commission %</Form.Label>
                  <Form.Control
                    type="number"
                    name="Commision_Percentage"
                    value={form.Commision_Percentage}
                    onChange={handleChange}
                    isInvalid={!!errors.Commision_Percentage}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.Commision_Percentage}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Discount %</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount_percent"
                    value={form.discount_percent}
                    onChange={handleChange}
                    isInvalid={!!errors.discount_percent}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.discount_percent}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    name="DisplayOrder"
                    value={form.DisplayOrder}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="Remark"
                    value={form.Remark}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center mt-3">
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="me-2 bi-arrow-up-circle-fill"
              >
                &nbsp;
                {editing ? "Update" : "Submit"}
              </Button>
              <Button
                variant="danger"
                className="bi-x-circle-fill bg-danger"
                onClick={editing ? cancelEdit : clearForm}
              >
                &nbsp;
                {editing ? "Cancel" : "Clear"}
              </Button>
            </div>
          </Card.Body>
        </Card>

        <hr className="mt-5" />

        {/* Departments Table */}
        <Card className="shadow mt-5">
          <Card.Body>
            <h5 className="text-primary mb-3">Department List</h5>
            <Table bordered responsive className="text-center">
              <thead>
                <tr>
                  <th className="bg-dark fw-bold text-white">ID</th>
                  <th className="bg-dark fw-bold text-white">Name</th>
                  <th className="bg-dark fw-bold text-white">Commission %</th>
                  <th className="bg-dark fw-bold text-white">Discount %</th>
                  <th className="bg-dark fw-bold text-white">Display Order</th>
                  <th className="bg-dark fw-bold text-white">Remark</th>
                  <th className="bg-dark fw-bold text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.dept_id}>
                    <td>{dept.dept_id}</td>
                    <td>{dept.dept_name}</td>
                    <td>{dept.Commision_Percentage}</td>
                    <td>{dept.discount_percent}</td>
                    <td>{dept.DisplayOrder}</td>
                    <td>{dept.Remark}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="bi bi-pen-fill fw-bold"
                        onClick={() => handleEdit(dept)}
                      >
                        &nbsp; Edit
                      </Button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No departments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default BaseDepartment;
