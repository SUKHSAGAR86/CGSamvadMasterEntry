import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Table, Modal } from "react-bootstrap";

const OfficerLevel = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    level_id: "",
    level_name: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Fetch all records
  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/officerlevel/get-officerlevel");
      setRecords(res.data);
    } catch (error) {
      console.error("Failed to fetch records", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const getClientTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // yyyy-mm-dd

    const time = now.toTimeString().split(" ")[0];

    return { date, time };
  };

  const getIpAddress = async () => {
    try {
      const res = await axios.get("https://api.ipify.org?format=json");
      return res.data.ip; // Public IP
    } catch {
      return "";
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { date, time } = getClientTime();
    const ip = await getIpAddress();

    try {
      if (editingId) {
        // Update
        await axios.put(`http://localhost:3080/api/officerlevel/update-officerlevel/${editingId}`, {
          level_name: form.level_name,
          modify_date: date,
          modify_time: time,
          modify_ip_address: ip,
        });
        setAlertMessage("Officer level updated successfully.");
      } else {
        // Create
        await axios.post("http://localhost:3080/api/officerlevel/add-officerlevel", {
          ...form,
          entry_date: date,
          entry_time: time,
          ip_address: ip,
        });
        setAlertMessage("Officer level added successfully.");
      }

      setForm({ level_id: "", level_name: "" });
      setEditingId(null);
      setShowAlert(true);
      fetchRecords();
    } catch (err) {
      console.error("Submission failed:", err);
      setAlertMessage("Something went wrong.");
      setShowAlert(true);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.level_id);
    setForm({
      level_id: record.level_id,
      level_name: record.level_name,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ level_id: "", level_name: "" });
  };

  return (
    <Container className="my-5">
      <div className="container-fluid d-flex justify-content-center">
        <Form
          onSubmit={handleSubmit}
          className="p-4 border rounded shadow bg-light"
          style={{ width: "700px" }}
        >
          <h2 className="text-center mb-4 bg-primary-subtle rounded">
            Officer Level
          </h2>
          {!editingId && (
            <Form.Group controlId="levelId" className="mb-3">
              <Form.Label className="fw-semibold">Level ID</Form.Label>
              <Form.Control
                type="text"
                name="level_id"
                value={form.level_id}
                onChange={handleChange}
                maxLength={2}
                required
              />
            </Form.Group>
          )}
          <Form.Group controlId="levelName" className="mb-4">
            <Form.Label className="fw-semibold">Level Name</Form.Label>
            <Form.Control
              type="text"
              name="level_name"
              value={form.level_name}
              onChange={handleChange}
              maxLength={50}
              required
            />
          </Form.Group>

          <div className="text-center d-flex justify-content-center gap-3">
            <Button type="submit" variant="primary">
              {editingId ? (
                <div className="bi bi-arrow-repeat">&nbsp; Update</div>
              ) : (
                <div className="bi-plus-circle-fill">&nbsp; Add</div>
              )}
            </Button>
            {editingId ? (
              <Button
                variant="danger"
                className="bi-x-circle-fill"
                onClick={handleCancel}
              >
                &nbsp; Cancel
              </Button>
            ) : (
              <Button
                variant="danger"
                className="bi-x-circle-fill"
                onClick={handleCancel}
              >
                &nbsp; Clear
              </Button>
            )}
          </div>
        </Form>
      </div>

      <hr className="my-5" />

      <h4 className="text-center mb-3">Officer Level List</h4>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Level ID</th>
            <th>Level Name</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.level_id}>
              <td>{record.level_id}</td>
              <td>{record.level_name}</td>
              <td className="text-center">
                <Button
                  className="bi bi-pen-fill fw-bold"
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(record)}
                >
                  &nbsp;Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Success/Alert Modal */}
      <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>{alertMessage}</p>
          <Button variant="success" onClick={() => setShowAlert(false)}>
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default OfficerLevel;
