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
  OfficeName: "",
  OfficeName_E: "",
  client_code: "",
  BaseDeptCode: "",
  OfficeLevel: "",
  NewOfficeCode: "",
  DistrictCodeNew: "",
  CountryCode: "",
  StateCode: "",
  OfficeAddress: "",
  OfficeArea: "",
  OfficePin: "",
  OfficeURL: "",
  landline_no: "",
  Email: "",
  Fax: "",
  std_code: "",
  Mobile_no: "",
  GST_legalName: "",
  GST_number: "",
  GST_StateID: "",
  GST_StateText: "",
  GST_DateOfRegistration: "",
  GST_TaxpayerType: "",
  flag: "",
  DisplayOrder: 1,
};

const Office = () => {
  const [formData, setFormData] = useState(initialForm);
  const [offices, setOffices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    fetchOffices();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchOffices = async () => {
    try {
      const response = await axios.get("http://localhost:3080/api/office/get-office");
      setOffices(response.data);
    } catch (err) {
      console.error("Error fetching offices:", err);
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
      if (cleanedData[key] === "") {
        cleanedData[key] = null;
      }
    });

    cleanedData.DisplayOrder = parseInt(cleanedData.DisplayOrder) || 1;

    try {
      if (editMode) {
        const { NewOfficeCode, ...payload } = cleanedData;
        await axios.put(`http://localhost:3080/api/office/update-office/${NewOfficeCode}`, payload);
        setMessage("Office updated successfully.");
      } else {
        await axios.post("http://localhost:3080/api/office/add-office", cleanedData);
        setMessage("Office created successfully.");
      }

      setFormData(initialForm);
      setEditMode(false);
      fetchOffices();
    } catch (err) {
      console.error("Error saving office:", err);
      if (err.response && err.response.data) {
        setMessage(`Error: ${err.response.data}`);
      } else {
        setMessage("An unexpected error occurred.");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const renderInput = (
    label,
    name,
    type = "text",
    required = true,
    placeholder = ""
  ) => (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={
          formData[name] !== null && formData[name] !== undefined
            ? formData[name]
            : ""
        }
        onChange={handleInputChange}
        required={required}
        placeholder={placeholder}
      />
      <Form.Control.Feedback type="invalid">
        Required field
      </Form.Control.Feedback>
    </Form.Group>
  );


  return (
    <Container className="my-4">
      <h2 className="text-center mt-4 mb-5 bg-success-subtle fw-bold p-2 rounded">
        Master Entry For Office{" "}
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
            variant={message.startsWith("") ? "success" : "danger"}
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
            {renderInput(
              "Office Name",
              "OfficeName",
              "text",
              true,
              "e.g., CGSamvad"
            )}
          </Col>
          <Col md={4}>
            {renderInput(
              "Office Name (English)",
              "OfficeName_E",
              "text",
              true,
              "e.g., CGSamvad"
            )}
          </Col>
          <Col md={4}>
            {editMode ? (
              <Form.Group className="mb-3" controlId="NewOfficeCode">
                <Form.Label>New Office Code</Form.Label>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={formData.NewOfficeCode}
                />
              </Form.Group>
            ) : (
              renderInput(
                "New Office Code",
                "NewOfficeCode",
                "text",
                true,
                "e.g., MH001"
              )
            )}
          </Col>

          <Col md={4}>
            {renderInput(
              "Client Code",
              "client_code",
              "text",
              true,
              "e.g., CL123"
            )}
          </Col>
          <Col md={4}>
            {renderInput(
              "Base Dept Code",
              "BaseDeptCode",
              "text",
              true,
              "e.g., DPT01"
            )}
          </Col>
          <Col md={4}>
            {renderInput(
              "Office Level",
              "OfficeLevel",
              "text",
              true,
              "e.g., Level 1"
            )}
          </Col>

          <Col md={4}>
            {renderInput(
              "District Code",
              "DistrictCodeNew",
              "text",
              true,
              "e.g., D123"
            )}
          </Col>
          <Col md={4}>
            {renderInput(
              "Country Code",
              "CountryCode",
              "text",
              true,
              "e.g., IN"
            )}
          </Col>
          <Col md={4}>
            {renderInput("State Code", "StateCode", "text", true, "e.g., CG")}
          </Col>

          <Col md={6}>
            {renderInput(
              "Office Address",
              "OfficeAddress",
              "text",
              true,
              "e.g., sector-19, Naya Raipur"
            )}
          </Col>
          <Col md={3}>
            {renderInput(
              "Office Area",
              "OfficeArea",
              "text",
              true,
              "e.g., Naya Raipur"
            )}
          </Col>
          <Col md={3}>
            {renderInput(
              "Office Pin",
              "OfficePin",
              "text",
              true,
              "e.g., 400001"
            )}
          </Col>

          <Col md={4}>
            {renderInput(
              "Office URL",
              "OfficeURL",
              "text",
              false,
              "e.g., https://company.com"
            )}
          </Col>
          <Col md={4}>
            {renderInput(
              "Landline No",
              "landline_no",
              "text",
              false,
              "e.g., 022-12345678"
            )}
          </Col>
          <Col md={4}>
            {renderInput("Fax", "Fax", "text", false, "e.g., 022-87654321")}
          </Col>

          <Col md={4}>
            {renderInput("STD Code", "std_code", "text", false, "e.g., 022")}
          </Col>
          <Col md={4}>
            {renderInput(
              "Mobile No",
              "Mobile_no",
              "text",
              true,
              "e.g., 9876543210"
            )}
          </Col>
          <Col md={4}>
            {renderInput(
              "Email",
              "Email",
              "email",
              true,
              "e.g., office@company.com"
            )}
          </Col>

          <Col md={6}>
            {renderInput(
              "GST Legal Name",
              "GST_legalName",
              "text",
              false,
              "e.g., Company Pvt Ltd"
            )}
          </Col>
          <Col md={3}>
            {renderInput(
              "GST Number",
              "GST_number",
              "text",
              false,
              "e.g., 27ABCDE1234F1Z5"
            )}
          </Col>
          <Col md={3}>
            {renderInput(
              "GST State ID",
              "GST_StateID",
              "text",
              false,
              "e.g., 27"
            )}
          </Col>

          <Col md={4}>
            {renderInput(
              "GST State Text",
              "GST_StateText",
              "text",
              false,
              "e.g., Maharashtra"
            )}
          </Col>
          <Col md={4}>
            {renderInput(
              "GST Date Of Registration",
              "GST_DateOfRegistration",
              "date",
              false
            )}
          </Col>
          <Col md={4}>
            {renderInput(
              "GST Taxpayer Type",
              "GST_TaxpayerType",
              "text",
              false,
              "e.g., Regular"
            )}
          </Col>

          <Col md={4}>
            {renderInput("Flag", "flag", "text", false, "e.g., 1")}
          </Col>
          <Col md={4}>
            {renderInput(
              "Display Order",
              "DisplayOrder",
              "number",
              false,
              "e.g., 1"
            )}
          </Col>
        </Row>
        <div className=" d-flex justify-content-center">
          <Button type="submit" disabled={loading} className="bi-arrow-up-circle-fill">&nbsp;
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : editMode ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>

          {editMode ? (
            <Button
              variant="danger"
              className="ms-2 bi-x-circle-fill"
              onClick={() => {
                setFormData(initialForm);
                setEditMode(false);
              }}
            > &nbsp;
              Cancel
            </Button>
          ) : (
            <Button
              variant="danger"
              className="ms-2 bi-x-circle-fill"
              onClick={() => {
                setFormData(initialForm);
                setEditMode(false);
              }}
            >&nbsp;
              Clear
            </Button>
          )}
        </div>
      </Form>

      <hr />

      <h4 className="mt-5">Office List</h4>
      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th className="bg-dark text-white">New Office Code</th>
            <th className="bg-dark text-white">Office Name</th>
            <th className="bg-dark text-white">Email Address</th>
            <th className="bg-dark text-white">Client Code</th>
            <th className="bg-dark text-white">Office Address</th>
            <th className="bg-dark text-white">Action</th>
          </tr>
        </thead>
        <tbody>
            {offices.map((office, index) => (
              <tr key={`${office.NewOfficeCode}-${index}`}>
                <td>{office.NewOfficeCode}</td>
                <td>{office.OfficeName}</td>
                <td>{office.Email}</td>
                <td>{office.client_code}</td>
                <td>{office.OfficeAddress}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="bi bi-pen-fill fw-bold"
                    onClick={() => handleEdit(office)}
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

export default Office;
