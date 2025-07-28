import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Container } from "react-bootstrap";

const FinancialYear = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    Sno: "",
    financial_year: "",
    status: "",
  });
  const [editingSno, setEditingSno] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For alert modal
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch all financial years
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3080/api/financialyear/get-financialyear");
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  // Generate next Sno when not editing
  useEffect(() => {
    const fetchNextSno = async () => {
      if (!editingSno) {
        try {
          const res = await axios.get(
        "http://localhost:3080/api/financialyear/get-financialyear"
          );
          const records = Array.isArray(res.data) ? res.data : [];
          let maxSno = "000";

          if (records.length > 0) {
        maxSno = records
          .map((r) => r.Sno)
          .sort()
          .slice(-1)[0]; // Get the highest Sno
          }

          const nextNumber = parseInt(maxSno, 10) + 1;
          const nextSno = nextNumber.toString().padStart(3, "0");

          setForm((prev) => ({ ...prev, Sno: nextSno }));
        } catch (err) {
          console.error("Failed to fetch next Sno");
        }
      }
    };

    fetchNextSno();
  }, [editingSno]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingSno) {
        await axios.put(
          `http://localhost:3080/api/financialyear/update-financialyear/${editingSno}`,
          {
            financial_year: form.financial_year,
            status: form.status,
          }
        );
        setAlertMessage(`Financial Year ${editingSno} updated successfully!`);
        setEditingSno(null);
      } else {
        await axios.post("http://localhost:3080/api/financialyear/add-financialyear", form);
        setAlertMessage(`Financial Year ${form.Sno} added successfully!`);
      }
      setForm({ Sno: "", financial_year: "", status: "Active" });
      fetchRecords();
      setShowAlert(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (record) => {
    setEditingSno(record.Sno);
    setForm({
      Sno: record.Sno,
      financial_year: record.financial_year,
      status: record.status,
    });
    setError(null);
  };

  const handleCancel = () => {
    setEditingSno(null);
    setForm({ Sno: "", financial_year: "", status: "" });
    setError(null);
  };

  const handleCloseAlert = () => setShowAlert(false);

  return (
    <div className="container-fluid mb-5 pb-5">
      <Container className="mt-5" style={{ maxWidth: "800px" }}>
        <h2 className="mb-4 text-center bg-success-subtle p-2">
          Financial Year
        </h2>

        <Form
          onSubmit={handleSubmit}
          className="border p-4 rounded shadow-sm bg-light"
        >
          <Form.Group controlId="formSno" className="mb-3">
            <Form.Label className="fw-bold">
              S.no <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="Sno"
              value={form.Sno}
              disabled
              className="fw-bold"
            />
          </Form.Group>

          <Form.Group controlId="formFinancialYear" className="mb-3">
            <Form.Label className="fw-bold">
              Financial Year <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              className="fw-bold"
              type="text"
              name="financial_year"
              value={form.financial_year}
              onChange={handleChange}
              maxLength={9}
              required
              placeholder="e.g. 2023-2024"
            />
          </Form.Group>

          <Form.Group controlId="formStatus" className="mb-4">
            <Form.Label className="fw-bold">
              Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="">---Select---</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>

          {error && <p className="text-danger">{error}</p>}

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="primary"
              type="submit"
              className="bi-plus-circle-fill"
              style={{ minWidth: "120px" }}
            >
              &nbsp;
              {editingSno ? "Update" : "Add"}
            </Button>
            {editingSno ? (
              <Button
                variant="danger"
                className="bi-x-circle-fill"
                onClick={handleCancel}
                style={{ minWidth: "120px" }}
              >
                &nbsp; Cancel
              </Button>
            ) : (
              <Button
                variant="danger"
                className="bi-x-circle-fill"
                onClick={handleCancel}
                style={{ minWidth: "120px" }}
              >
                &nbsp; Clear
              </Button>
            )}
          </div>
        </Form>
      </Container>

      <div
        className="container-fluid text-center"
        style={{ maxWidth: "1000px" }}
      >
        <hr className="my-5" />
        <h4 className="mb-3 text-center bg-primary-subtle p-2 fw-bold">
          Financial Year List
        </h4>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Sno</th>
                <th>Financial Year</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(records) && records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.Sno}>
                    <td>{record.Sno}</td>
                    <td>{record.financial_year}</td>
                    <td>
                      <span
                        className={`badge ${
                          record.status === "Active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        className="bi bi-pen-fill"
                        variant="warning"
                        size="sm"
                        onClick={() => handleEdit(record)}
                      >
                        &nbsp;Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Centered Alert Modal */}
        <Modal show={showAlert} onHide={handleCloseAlert} centered>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>{alertMessage}</p>
            <Button variant="success" onClick={handleCloseAlert}>
              OK
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default FinancialYear;
