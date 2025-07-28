
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Alert,
  Table,
} from "react-bootstrap";

const initialForm = {
  user_id: "",
  username: "",
  address: "",
  mobile: "",
  dob: "",
  pwd: "",
  confirmPwd: "",
  user_type_code: "",
  first_login: "1",
  section_cd: "",
  login_flag: "1",
  pwd_changed_date: "",
  user_status: "A",
  who_created: "Admin",
};

const UserCreation = () => {
  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [editMode, setEditMode] = useState(false);

  const apiBase = "http://localhost:3080/api";

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiBase}/deptusers`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        username,
        pwd,
        confirmPwd,
        user_type_code,
        section_cd,
      } = formData;

      if (!username || !pwd || !confirmPwd) {
        return showAlert("Please fill required fields", "danger");
      }

      if (pwd !== confirmPwd) {
        return showAlert("Password and Confirm Password do not match", "danger");
      }

      if (editMode) {
        await axios.put(`${apiBase}/deptuser-update/${formData.user_id}`, {
          ...formData,
          modify_by_user_name: "Admin",
          password_reset_by_user_id: "Admin",
          password_reset_by_user_name: "Admin",
        });
        showAlert("User updated successfully!");
      } else {
        const response = await axios.post(`${apiBase}/deptuser-register`, {
          ...formData,
          pwd_changed_date: new Date().toISOString().split("T")[0],
        });
        showAlert(`User registered successfully! ID: ${response.data.user_id}`);
      }

      setFormData(initialForm);
      setEditMode(false);
      fetchUsers();
    } catch (err) {
      console.error("Submission Error:", err);
      showAlert("Operation failed: " + (err.response?.data?.error || err.message), "danger");
    }
  };

  const handleEdit = (user) => {
    setFormData({
      ...user,
      pwd: "",
      confirmPwd: "",
      pwd_changed_date: user.pwd_changed_date?.split("T")[0] || "",
    });
    setEditMode(true);
  };

  return (
    <Container className="mt-4">
      <h3 className="text-center mb-3">User Creation</h3>
      {alert.show && (
        <Alert variant={alert.variant} className="text-center">
          {alert.message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          {editMode && (
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>User ID</Form.Label>
                <Form.Control name="user_id" value={formData.user_id} readOnly disabled />
              </Form.Group>
            </Col>
          )}

          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Username*</Form.Label>
              <Form.Control name="username" value={formData.username} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Password*</Form.Label>
              <Form.Control type="password" name="pwd" value={formData.pwd} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Confirm Password*</Form.Label>
              <Form.Control type="password" name="confirmPwd" value={formData.confirmPwd} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Mobile</Form.Label>
              <Form.Control name="mobile" value={formData.mobile} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>DOB</Form.Label>
              <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>User Type Code</Form.Label>
              <Form.Control name="user_type_code" value={formData.user_type_code} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Section Code</Form.Label>
              <Form.Control name="section_cd" value={formData.section_cd} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center mt-3">
          <Button type="submit" variant={editMode ? "warning" : "primary"}>
            {editMode ? "Update User" : "Register User"}
          </Button>
          {editMode && (
            <Button variant="secondary" className="ms-2" onClick={() => {
              setEditMode(false);
              setFormData(initialForm);
            }}>
              Cancel
            </Button>
          )}
        </div>
      </Form>

      <h5 className="mt-5 text-center">All Registered Users</h5>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>DOB</th>
            <th>User Type</th>
            <th>Section</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.mobile}</td>
                <td>{user.dob?.split("T")[0]}</td>
                <td>{user.user_type_code}</td>
                <td>{user.section_cd}</td>
                <td>{user.user_status}</td>
                <td>
                  <Button variant="outline-primary" size="sm" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserCreation;

