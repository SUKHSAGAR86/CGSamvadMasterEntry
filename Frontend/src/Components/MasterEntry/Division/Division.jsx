import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Spinner, Card, Modal } from "react-bootstrap";

const Division = () => {
  const [divisions, setDivisions] = useState([]);
  const [formData, setFormData] = useState({
    Division_name_Hindi: "",
    Division_name_English: "",
    flag: "",
    Display_order: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [loading, setLoading] = useState(false);

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3080/api/division/get-division");
      setDivisions(res.data);
    } catch (err) {
      showAlert("Error fetching divisions", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert flag dropdown to number
    const updatedValue = name === "flag" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3080/api/division/update-division/${editingId}`,
          formData
        );
        showAlert("Division updated successfully!", "success");
      } else {
        await axios.post("http://localhost:3080/api/division/add-division", formData);
        showAlert("Division added successfully!", "success");
      }
      setFormData({
        Division_name_Hindi: "",
        Division_name_English: "",
        flag: "",
        Display_order: "",
      });
      setEditingId(null);
      fetchDivisions();
    } catch (err) {
      showAlert("Operation failed", "danger");
    }
  };

  const handleEdit = (division) => {
    setFormData({
      Division_name_Hindi: division.Division_name_Hindi,
      Division_name_English: division.Division_name_English,
      flag: division.flag, // correctly mapped
      Display_order: division.Display_order,
    });
    setEditingId(division.Division_id);
  };

  const handleCancel = () => {
    setFormData({
      Division_name_Hindi: "",
      Division_name_English: "",
      flag: "",
      Display_order: "",
    });
    setEditingId(null);
  };

  return (
    <div className="container mt-4">
      {/* Centered Modal Alert */}
      <Modal
        show={alert.show}
        onHide={() => setAlert({ ...alert, show: false })}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className={`text-center bg-${alert.variant} text-white fw-bold`}>
          {alert.message}
        </Modal.Body>
      </Modal>

      {/* Form Section */}
      <Card className="p-4 shadow-sm mb-4">
        <h4 className="mb-3 bg-success-subtle text-center p-2 mb-4">
          {editingId ? "Edit Division" : "Add New Division"}
        </h4>
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <div className="g-3 row">
              <div className="col">
                <Form.Group>
                  <Form.Label>Division Name (Hindi)</Form.Label>
                  <Form.Control
                    type="text"
                    name="Division_name_Hindi"
                    value={formData.Division_name_Hindi}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group>
                  <Form.Label>Division Name (English)</Form.Label>
                  <Form.Control
                    type="text"
                    name="Division_name_English"
                    value={formData.Division_name_English}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="flag"
                    value={formData.flag}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col">
                <Form.Group>
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    name="Display_order"
                    value={formData.Display_order}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" variant="primary bi-arrow-up-circle-fill">
                  &nbsp;{editingId ? "Update" : "Submit"}
                </Button>
                {editingId ? (
                  <Button
                    variant="danger"
                    onClick={handleCancel}
                    className="ms-3 fw-bold bg-danger bi-x-circle-fill"
                  >
                    &nbsp;Cancel
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={handleCancel}
                    className="ms-3 bi-x-circle-fill"
                  >
                    &nbsp;Clear
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="shadow-sm mt-5 text-center">
        <h5 className="mb-3 bg-primary-subtle text-center p-2">
          Division List
        </h5>
        <Card.Body>
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="bg-secondary">ID</th>
                  <th className="bg-secondary">Hindi Name</th>
                  <th className="bg-secondary">English Name</th>
                  <th className="bg-secondary">Status</th>
                  <th className="bg-secondary">Display Order</th>
                  <th className="bg-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {divisions.map((div) => (
                  <tr key={div.Division_id}>
                    <td>{div.Division_id}</td>
                    <td>{div.Division_name_Hindi}</td>
                    <td>{div.Division_name_English}</td>
                    <td>{div.flag === 1 ? "Active" : "Inactive"}</td>
                    <td>{div.Display_order}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="bi bi-pen-fill"
                        onClick={() => handleEdit(div)}
                      >
                        &nbsp; Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Division;
