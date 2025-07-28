import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Table,
  Spinner,
} from "react-bootstrap";

const initialForm = {
  DistrictCode: "",
  employee_id: "",
  employee_name: "",
  employee_name_E: "",
  employee_dob: "",
  employee_mob: "",
  employee_emailid: "",
  employee_alt_mobile: "",
  employe_alt_email: "",
  CountryCode: "",
  StateCode: "",
  designation_id: "",
  user_code: "",
  emp_level: "",
  office_mobile_no:"",
  address: "",
  OfficeCode: "",
  OfficerCode: "",
  OldDistrictCode: "",
  BaseDepartCode: "",
  OfficeArea: "",
  OfficePin: "",
  entryyear: "",
  flag: "",
  
  DisplayOrder: 1,
};

const Officer = () => {
  const [formData, setFormData] = useState(initialForm);
  const [officer, setOfficer] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    fetchOfficer();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchOfficer = async () => {
    try {
      const response = await axios.get("http://localhost:3080/api/officer/get-officer");
      setOfficer(response.data);
    } catch (err) {
      console.error("Error fetching officer:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    const cleanedData = { ...formData };
    Object.keys(cleanedData).forEach((key) => {
      if (cleanedData[key] === "") cleanedData[key] = null;
    });

    cleanedData.DisplayOrder = parseInt(cleanedData.DisplayOrder) || 1;

    try {
      if (editMode) {
        const {  ...payload } = cleanedData;
        await axios.put(`http://localhost:3080/api/officer/update-officer/${formData.employee_id}`, payload);
        setMessage("Officer updated successfully.");
      } else {
        await axios.post("http://localhost:3080/api/officer/add-officer", cleanedData);
        setMessage("Officer created successfully.");
      }

      setFormData(initialForm);
      setEditMode(false);
      fetchOfficer();
    } catch (err) {
      console.error("Error saving officer:", err);
      setMessage(err.response?.data || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setValidated(false);
    }
  };

  const handleEdit = (office) => {
    setFormData(office);
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderInput = (label, name, type = "text", required = true, placeholder = "") => {
    if (typeof type !== "string") type = "text";
    return (
      <Form.Group className="mb-3" controlId={name}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          name={name}
          value={formData[name] || ""}
          onChange={handleInputChange}
          required={required}
          placeholder={placeholder}
        />
        <Form.Control.Feedback type="invalid">Required field</Form.Control.Feedback>
      </Form.Group>
    );
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mt-4 mb-5 bg-success-subtle fw-bold p-2 rounded">
        Master Entry For Officer
      </h2>

      {message && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <Alert
            variant={message.toLowerCase().includes("success") ? "success" : "danger"}
            className="text-center shadow-lg"
            style={{ maxWidth: "500px", width: "90%" }}
          >
            {message}
          </Alert>
        </div>
      )}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row>
      <Col md={4}>
    {editMode ? (
      <Form.Group className="mb-3" controlId="employee_id">
        <Form.Label>Employee Id</Form.Label>
        <Form.Control plaintext readOnly value={formData.employee_id || ""} />
      </Form.Group>
    ) : (
      renderInput("Employee Id", "employee_id", "text", true, "e.g. EMP001")
    )}
  </Col>
  <Col md={4}>{renderInput("Employee Name", "employee_name", "text", true, "e.g. Ramesh Kumar")}</Col>
  <Col md={4}>{renderInput("Employee Name (English)", "employee_name_E", "text", true, "e.g. Ramesh Kumar")}</Col>
  <Col md={4}>{renderInput("DOB", "employee_dob", "date", true)}</Col>
  <Col md={4}>{renderInput("Mobile No", "employee_mob", "text", true, "e.g. 9876543210")}</Col>
  <Col md={4}>{renderInput("Email", "employee_emailid", "email", true, "e.g. ramesh@example.com")}</Col>
  <Col md={4}>{renderInput("Alt Mobile", "employee_alt_mobile", "text", false, "e.g. 9123456789")}</Col>
  <Col md={4}>{renderInput("Alt Email", "employe_alt_email", "email", false, "e.g. alt.ramesh@mail.com")}</Col>
  <Col md={4}>{renderInput("Country Code", "CountryCode", "text", true, "e.g. IN")}</Col>
  <Col md={4}>{renderInput("State Code", "StateCode", "text", true, "e.g. CG")}</Col>
  <Col md={4}>{renderInput("District Code", "DistrictCode", "text", true, "e.g. 101")}</Col>
  <Col md={4}>{renderInput("Old District Code", "OldDistrictCode", "text", false, "e.g. 091")}</Col>
  <Col md={4}>{renderInput("Designation Id", "designation_id", "text", true, "e.g. D001")}</Col>
  <Col md={4}>{renderInput("User Code", "user_code", "text", true, "e.g. U123")}</Col>
  <Col md={4}>{renderInput("Employee Address", "address", "text", false, "e.g. 12, MG Road, Raipur")}</Col>
  <Col md={4}>{renderInput("Office Code", "OfficeCode", "text", false, "e.g. OC45")}</Col>
  <Col md={4}>{renderInput("Officer Code", "OfficerCode", "text", false, "e.g. OFF123")}</Col>
 <Col md={4}>{renderInput("Office Mobile","office_mobile_no","text",false,"eg. 9988776645" )}</Col>
  <Col md={4}>{renderInput("Base Depart Code", "BaseDepartCode", "text", true, "e.g. BD202")}</Col>
  <Col md={4}>{renderInput("Employee Level", "emp_level", "text", true, "e.g. L2")}</Col>
  <Col md={4}>{renderInput("Office Area", "OfficeArea", "text", false, "e.g. Zone 3, Block B")}</Col>
  <Col md={4}>{renderInput("Office Pin", "OfficePin", "text", true, "e.g. 492001")}</Col>
  <Col md={4}>{renderInput("Entry Year", "entryyear", "text", false, "e.g. 2022")}</Col>
  <Col md={4}>{renderInput("Flag", "flag", "text", false, "e.g. 1")}</Col>
  <Col md={4}>{renderInput("Display Order", "DisplayOrder", "number", false, "e.g. 1")}</Col>
</Row>

      <div className="d-flex justify-content-center mb-4">
      <Button type="submit" disabled={loading} className="bi-arrow-up-circle-fill">&nbsp;
          {loading ? <Spinner animation="border" size="sm" /> : editMode ? "Update" : "Submit"}
        </Button>

        {editMode ? (
          <Button
            variant="danger"
            className="ms-2 bi-x-circle-fill"
            onClick={() => {
              setFormData(initialForm);
            
            }}
          >&nbsp;
            Cancel
          </Button>
        ):(   <Button
          variant="danger"
          className="ms-2 bi-x-circle-fill"
          onClick={() => {
            setFormData(initialForm);
            setEditMode(false);
          }}
        >&nbsp;
          Clear
        </Button>)}
      </div>
        
      </Form>

      <hr />

      <h4 className="mt-5">Officer List</h4>
      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th className="bg-dark text-white">Employee Id</th>
            <th className="bg-dark text-white">Name</th>
            <th className="bg-dark text-white">Email</th>
            <th className="bg-dark text-white">Mobile</th>
            <th className="bg-dark text-white">Address</th>
            <th className="bg-dark text-white">Entry Year</th>
            <th className="bg-dark text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {officer.map((o) => (
            <tr key={o.employee_id}>
              <td>{o.employee_id}</td>
              <td>{o.employee_name}</td>
              <td>{o.employee_emailid}</td>
              <td>{o.employee_mob}</td>
              <td>{o.address}</td>
              <td>{o.entryyear}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="bi bi-pen-fill fw-bold"
                  onClick={() => handleEdit(o)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Officer;
