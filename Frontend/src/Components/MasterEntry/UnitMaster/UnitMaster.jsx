
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Alert } from "react-bootstrap";

const UnitMaster = () => {
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState("");
  const [unitId, setUnitId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [validated, setValidated] = useState(false);

  // Fetch units
  const fetchUnits = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/unitmaster/get-unitmaster");
      setUnits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  // Alert function
  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    if (!unit.trim()) return;

    try {
      if (unitId) {
        // Update
        await axios.put(`http://localhost:3080/api/unitmaster/update-unitmaster/${unitId}`, { unit });
        showAlert("Unit updated successfully", "info");
      } else {
        // Add
        await axios.post("http://localhost:3080/api/unitmaster/add-unitmaster", { unit });
        showAlert("Unit added successfully", "success");
      }
      setUnit("");
      setUnitId(null);
      fetchUnits();
      setValidated(false);
    } catch (err) {
      console.error(err);
      showAlert("Enter only Three Character! like- ABC ", "danger");
    }
  };

  const handleEdit = (id) => {
    const selected = units.find((u) => u.unit_id === id);
    if (selected) {
      setUnit(selected.unit);
      setUnitId(selected.unit_id);
    }
  };

   return (
    <div className="container-fluid mt-4">
   <div className="d-flex justify-content-center align-items-center">
   <div className="card w-50  mt-2 mb-3">
      <h3 className="text-center mb-4 card-header bg-primary-subtle fw-bold">Unit Master</h3>

      {alert.show && (
        <div
          className="position-fixed top-50 start-50 translate-middle z-3"
          style={{ minWidth: "300px" }}
        >
          <Alert variant={alert.variant} className="text-center">
            {alert.message}
          </Alert>
        </div>
      )}
    <Form noValidate validated={validated} onSubmit={handleSubmit} className="card-body">
  
  {unitId && (
    <Form.Group controlId="unitId" className="mb-3 row align-items-center fw-bold">
    <Form.Label className="col-3 col-form-label">Unit ID:-</Form.Label>
    <div className="col">
      <Form.Control
        type="text"
        value={unitId}
        readOnly
        plaintext
        className="fw-bold"
      />
    </div>
  </Form.Group>
  )}

  <Form.Group controlId="unitName" className="mb-3">
    <Form.Label>Unit Name</Form.Label>
    <Form.Control
      type="text"
      placeholder="Enter Unit"
      value={unit}
      onChange={(e) => setUnit(e.target.value)}
      required
    />
    <Form.Control.Feedback type="invalid">
      Please enter a unit name!
    </Form.Control.Feedback>
  </Form.Group>

  <div className="d-flex gap-2  d-lg-flex justify-content-center mt-3 ">
    <Button type="submit" className="fw-bold">
      {unitId ? (
        <>
          <i className="bi bi-file-earmark-check-fill fw-bold"></i> Update
        </>
      ) : (
        <>
          <i className="bi bi-check-circle-fill fw-bold"></i> Submit
        </>
      )}
    </Button>

    <Button className="fw-bold"
      variant="danger"
      onClick={() => {
        setUnit("");
        setUnitId(null);
        setValidated(false);
      }}
    >
      <i className="bi bi-eraser-fill"></i> Clear
    </Button>
  </div>
</Form>
  </div>
   </div>

      <hr/>
    
      <div className="table-responsive align-items-center text-center ">
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Sn</th>
              <th>Unit ID</th>
              <th>Unit Name</th>
              <th>Entry Date</th>
              <th>Entry Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u, i) => (
              <tr key={u.unit_id}>
                <td>{i + 1}</td>
                <td>{u.unit_id}</td>
                <td>{u.unit}</td>
                <td>{u.entry_date?.split("T")[0]}</td>
                <td>{u.entry_time}</td>
                 <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2 fw-bold"
                    onClick={() => handleEdit(u.unit_id)}
                  >
                    <i className="bi bi-pen-fill"></i>&nbsp;
                    Edit
                  </Button>
                  </td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No units found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UnitMaster;
