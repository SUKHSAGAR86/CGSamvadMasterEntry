import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";

const initialForm = {
  employee_cd: "",
  name_E: "",
  name_H: "",
  office_address_E: "",
  office_address_H: "",
  emp_address_E: "",
  emp_address_H: "",
  designation_cd: "",
  rti_desig_cd: "",
  email_id: "",
  mobile_no: "",
  landline_no: "",
  fax_no: "",
  std_code: "",
  display_in_directory: 0,
  order_no: 0,
  salary_detail: "",
  section_cd: "",
  flag: 0,
  dob: "",
  section_wark: "",
  user_active: "",
  user_type_code: "",
  joining_date: "",
  Order_number: "",
  Retirement_date: "",
  OpeningLeave_id: "",
  OpeningEarned_Leave: 0,
  OpeningCommuted_Leave: 0,
  OpeningEmergency_Leave: 0,
  OpeningOptional_Leave: 0,
  ForAttendence: 0,
  jobtype: "",
  entry_by_user_id: "",
  entry_by_user_name: "",
  modify_by_user_id: "",
  modify_by_user_name: "",
};

const Employee = () => {
  const [formData, setFormData] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [editMode, setEditMode] = useState(false);

  // Fetch all employees on component mount
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3080/api/employee/get-employee");
      setEmployees(res.data);
    } catch (err) {
      showAlert("Error fetching employees", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 1500);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? (checked ? 1 : 0) : value;
    setFormData({ ...formData, [name]: val });
  };

  // Handle submit: add or update based on editMode
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: employee_cd required for both add/edit
    if (!formData.employee_cd) {
      showAlert("Employee Code is required", "warning");
      return;
    }

    try {
      if (editMode) {
        // Update
        await axios.put(
          `http://localhost:3080/api/employee/update-employee/${formData.employee_cd}`,
          formData
        );
        showAlert("Employee Updated Successfully");
      } else {
        // Create
        await axios.post("http://localhost:3080/api/employee/add-employee", formData);
        showAlert("Employee Added Successfully");
      }
      setFormData(initialForm);
      setEditMode(false);
      fetchEmployees();
    } catch (err) {
      showAlert(err.response?.data || err.message, "danger");
    }
  };

  // Fill form for editing
  const handleEdit = (employee) => {
    // Convert dates to YYYY-MM-DD for inputs if present
    const parseDate = (d) => (d ? d.split("T")[0] : "");
    setFormData({
      ...employee,
      dob: parseDate(employee.dob),
      joining_date: parseDate(employee.joining_date),
      Retirement_date: parseDate(employee.Retirement_date),
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const cancelEdit = () => {
    setFormData(initialForm);
    setEditMode(false);
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center bg-primary-subtle p-2 rounded">
        Employee Master Entry
      </h2>

      {alert.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.5)", // optional dim background
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Alert
            variant={alert.variant}
            onClose={() => setAlert({ show: false })}
            dismissible
            className="text-center shadow-lg fs-6 fw-bold"
            style={{ minWidth: "300px", maxWidth: "90%" }}
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <Form onSubmit={handleSubmit} className="mt-5">
        <Row>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="employee_cd">
              <Form.Label>Employee Code *</Form.Label>
              <Form.Control
                type="text"
                name="employee_cd"
                value={formData.employee_cd}
                onChange={handleChange}
                placeholder="e.g. EMP01"
                disabled={editMode} // Disable code editing while editing
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="name_E">
              <Form.Label>Name (English)</Form.Label>
              <Form.Control
                type="text"
                name="name_E"
                value={formData.name_E}
                onChange={handleChange}
                placeholder="e.g. Sagar "
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="name_H">
              <Form.Label>Name (Hindi)</Form.Label>
              <Form.Control
                type="text"
                name="name_H"
                value={formData.name_H}
                onChange={handleChange}
                placeholder="e.g. सागर "
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="email_id">
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="email"
                name="email_id"
                value={formData.email_id}
                onChange={handleChange}
                placeholder="Email Address"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="mobile_no">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleChange}
                placeholder="10-digit Mobile Number"
                maxLength={10}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="emp_address_E">
              <Form.Label>Employee Address (English)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="emp_address_E"
                value={formData.emp_address_E}
                onChange={handleChange}
                placeholder="Employee Address in English"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2" controlId="emp_address_H">
              <Form.Label>Employee Address (Hindi)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="emp_address_H"
                value={formData.emp_address_H}
                onChange={handleChange}
                placeholder="Employee Address in Hindi"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Add more inputs row wise */}

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="office_address_E">
              <Form.Label>Office Address (English)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="office_address_E"
                value={formData.office_address_E}
                onChange={handleChange}
                placeholder="Office Address in English"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2" controlId="office_address_H">
              <Form.Label>Office Address (Hindi)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="office_address_H"
                value={formData.office_address_H}
                onChange={handleChange}
                placeholder="Office Address in Hindi"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Form.Group className="mb-2" controlId="landline_no">
              <Form.Label>Landline Number</Form.Label>
              <Form.Control
                type="text"
                name="landline_no"
                value={formData.landline_no}
                onChange={handleChange}
                placeholder="Landline Number"
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-2" controlId="fax_no">
              <Form.Label>Fax Number</Form.Label>
              <Form.Control
                type="text"
                name="fax_no"
                value={formData.fax_no}
                onChange={handleChange}
                placeholder="Fax Number"
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-2" controlId="std_code">
              <Form.Label>STD Code</Form.Label>
              <Form.Control
                type="text"
                name="std_code"
                value={formData.std_code}
                onChange={handleChange}
                placeholder="STD Code"
              />
            </Form.Group>
          </Col>

          <Col md={3} className="pt-4">
            <Form.Group className="mb-2" controlId="display_in_directory">
              <Form.Check
                type="checkbox"
                label="Display in Directory"
                name="display_in_directory"
                checked={formData.display_in_directory === 1}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="designation_cd">
              <Form.Label>Designation Code</Form.Label>
              <Form.Control
                type="text"
                name="designation_cd"
                value={formData.designation_cd}
                onChange={handleChange}
                placeholder="e.g. D01"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="rti_desig_cd">
              <Form.Label>RTI Designation Code</Form.Label>
              <Form.Control
                type="text"
                name="rti_desig_cd"
                value={formData.rti_desig_cd}
                onChange={handleChange}
                placeholder="e.g R01"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="order_no">
              <Form.Label>Order Number</Form.Label>
              <Form.Control
                type="number"
                name="order_no"
                placeholder="eg. ORD123"
                value={formData.order_no}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Form.Group className="mb-2" controlId="joining_date">
              <Form.Label>Joining Date</Form.Label>
              <Form.Control
                type="date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-2" controlId="jobtype">
              <Form.Label>Job Type</Form.Label>
              <Form.Control
                type="text"
                name="jobtype"
                placeholder="eg. Permanent"
                value={formData.jobtype}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="salary_detail">
              <Form.Label>Salary Detail</Form.Label>
              <Form.Control
                type="text"
                name="salary_detail"
                value={formData.salary_detail}
                onChange={handleChange}
                placeholder="e.g. ₹50,000"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="section_cd">
              <Form.Label>Section Code</Form.Label>
              <Form.Control
                type="text"
                name="section_cd"
                placeholder="e.g S01"
                value={formData.section_cd}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="section_wark">
              <Form.Label>Section Work</Form.Label>
              <Form.Control
                type="text"
                name="section_wark"
                placeholder="e.g. NIC, Account, RO"
                value={formData.section_wark}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="flag">
              <Form.Label>Flag</Form.Label>
              <Form.Control
                type="number"
                name="flag"
                value={formData.flag}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="user_active">
              <Form.Label>User Active (Y/N)</Form.Label>
              <Form.Select
                name="user_active"
                value={formData.user_active}
                onChange={handleChange}
              >
                <option value="">-- Select --</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="user_type_code">
              <Form.Label>User Type Code</Form.Label>
              <Form.Control
                type="text"
                name="user_type_code"
                value={formData.user_type_code}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="Order_number">
              <Form.Label>Order Number (String)</Form.Label>
              <Form.Control
                type="text"
                name="Order_number"
                value={formData.Order_number}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Form.Group className="mb-2" controlId="Retirement_date">
              <Form.Label>Retirement Date</Form.Label>
              <Form.Control
                type="date"
                name="Retirement_date"
                value={formData.Retirement_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-2" controlId="OpeningLeave_id">
              <Form.Label>Opening Leave ID</Form.Label>
              <Form.Control
                type="text"
                name="OpeningLeave_id"
                placeholder="eg. LV001"
                value={formData.OpeningLeave_id}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-2" controlId="OpeningEarned_Leave">
              <Form.Label>Opening Earned Leave</Form.Label>
              <Form.Control
                type="number"
                name="OpeningEarned_Leave"
                value={formData.OpeningEarned_Leave}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-2" controlId="OpeningCommuted_Leave">
              <Form.Label>Opening Commuted Leave</Form.Label>
              <Form.Control
                type="number"
                name="OpeningCommuted_Leave"
                value={formData.OpeningCommuted_Leave}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="OpeningEmergency_Leave">
              <Form.Label>Opening Emergency Leave</Form.Label>
              <Form.Control
                type="number"
                name="OpeningEmergency_Leave"
                value={formData.OpeningEmergency_Leave}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="OpeningOptional_Leave">
              <Form.Label>Opening Optional Leave</Form.Label>
              <Form.Control
                type="number"
                name="OpeningOptional_Leave"
                value={formData.OpeningOptional_Leave}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2" controlId="ForAttendence">
              <Form.Label>For Attendance</Form.Label>
              <Form.Control
                type="number"
                name="ForAttendence"
                value={formData.ForAttendence}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="entry_by_user_id">
              <Form.Label>Entry By User ID</Form.Label>
              <Form.Control
                type="text"
                name="entry_by_user_id"
                value={formData.entry_by_user_id}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="entry_by_user_name">
              <Form.Label>Entry By User Name</Form.Label>
              <Form.Control
                type="text"
                name="entry_by_user_name"
                value={formData.entry_by_user_name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="modify_by_user_id">
              <Form.Label>Modify By User ID</Form.Label>
              <Form.Control
                type="text"
                name="modify_by_user_id"
                value={formData.modify_by_user_id}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2" controlId="modify_by_user_name">
              <Form.Label>Modify By User Name</Form.Label>
              <Form.Control
                type="text"
                name="modify_by_user_name"
                value={formData.modify_by_user_name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center my-3 fw-bold">
          <Button type="submit" variant="primary" className="me-2 bi-arrow-up-circle-fill">&nbsp;
            {editMode ? "Update" : "Submit"}
          </Button>
          {editMode ? (
            <Button
              variant="danger"
              onClick={cancelEdit}
              className="bi-x-circle-fill"
            >
              &nbsp; Cancel
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={cancelEdit}
              className="bi-x-circle-fill"
            >
              &nbsp; Clear
            </Button>
          )}
        </div>
      </Form>

      <hr />

      <h4 className="mt-4 mb-3 text-center">Employee Records</h4>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="text-center">
          <thead>
            <tr>
              <th className="bg-dark text-white fw-bold">Employee Code</th>
              <th className="bg-dark text-white fw-bold">Name</th>
              <th className="bg-dark text-white fw-bold">Mobile</th>
              <th className="bg-dark text-white fw-bold">Email</th>
              <th className="bg-dark text-white fw-bold">Job Type</th>
              <th className="bg-dark text-white fw-bold">Work Section</th>
              <th className="bg-dark text-white fw-bold">Joining Date</th>
              <th className="bg-dark text-white fw-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No records found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.employee_cd}>
                  <td>{emp.employee_cd}</td>
                  <td>{emp.name_E}</td>
                  <td>{emp.mobile_no}</td>
                  <td>{emp.email_id}</td>
                  <td>{emp.jobtype}</td>
                  <td>{emp.section_wark}</td>
                  <td>{emp.joining_date}</td>
                  <td>
                    <Button
                      variant="warning fw-bold bi-pen-fill"
                      size="sm"
                      onClick={() => handleEdit(emp)}
                    >
                      &nbsp; Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
export default Employee;
