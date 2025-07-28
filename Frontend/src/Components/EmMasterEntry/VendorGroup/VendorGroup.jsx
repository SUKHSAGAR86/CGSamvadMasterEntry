import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const VendorGroup = () => {
  const [formData, setFormData] = useState({
    group_id: "",
    group_name: "",
    status: "",
    entry_by_user_type: "",
    entry_by_user_id: "",
    entry_by_user_name: "",
    modify_by_user_type: "",
    modify_by_user_id: "",
    modify_by_user_name: "",
  });

  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const formRef = useRef(null);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/vendorgroup/get-vendorgroup");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
       if (!formData.group_name) {
      newErrors.group_name = "Required";
    } else if (!/^[A-Za-z].*$/.test(formData.group_name)) {
      newErrors.group_name = "Must start with a Alphabet";
    }
    if (!formData.status) newErrors.status = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) {
    showAlert("Invalid entry", "danger");
    return;
  }
  try {
    if (editId) {
      await axios.put(
        `http://localhost:3080/api/vendorgroup/update-vendorgroup/${editId}`,
        formData
      );
      showAlert(`Updated successfully ${editId}`);
    } else {
      const res = await axios.post(
        "http://localhost:3080/api/vendorgroup/add-vendorgroup",
        formData
      );
      const newId = res.data.group_id;
      showAlert(`Created successfully with ID ${newId}`);
    }

    fetchData();
    setFormData({ group_name: "", status: "" });
    setErrors({});
    setEditId(null);
  } catch (err) {
    showAlert(`Group name already exists.`, "danger");
  }
};


  const handleEdit = (item) => {
    setFormData({ ...item });
    setEditId(item.group_id);
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" }); // Start data from A2
  XLSX.utils.sheet_add_aoa(ws, [["Vendor Groups"]], { origin: "A1" }); // Title in A1

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "VendorGroups");
  XLSX.writeFile(wb, "VendorGroups.xlsx");
};

  const exportToPDF = () => {
    const doc = new jsPDF();
   // Title
  doc.setFontSize(16);
  doc.text("Vendor Group List - Page " + currentPage, 14, 15); // title

  // Data for current page only
  const currentPageData = paginatedData.map((item) => [
    item.group_id,
    item.group_name,
    item.status === "1" ? "Active" : "Inactive",
  ]);

  autoTable(doc, {
    startY: 20,
    head: [["Group ID", "Group Name", "Status"]],
    body: currentPageData,
  });

  doc.save(`VendorGroups_Page${currentPage}.pdf`);
};

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Vendor Group Master</h4>
      {alert.show && (
        <Alert
          variant={alert.variant}
          className="text-center position-fixed top-50 start-50 translate-middle z-3 w-50 shadow"
        >
          {alert.message}
        </Alert>
      )}
      <Card className="p-3 mb-4 shadow" ref={formRef}>
        <Form onSubmit={handleSubmit}>
          <Row>
            {["group_name", "status"].map((field, idx) => (
              <Col md={4} key={idx} className="mb-3">
                <Form.Group>
                  <Form.Label className="text-capitalize">{field.replaceAll("_", " ")}</Form.Label>
                  {field === "status" ? (
                    <Form.Control
                      as="select"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      isInvalid={!!errors[field]}
                    >
                      <option value="">Select</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </Form.Control>
                  ) : (
                    <Form.Control
                      type="text"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      isInvalid={!!errors[field]}
                    />
                  )}
                  {errors[field] && (
                    <Form.Control.Feedback type="invalid">
                      {errors[field]}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
          <div className="text-end">
            {editId ? (
              <>
                <Button type="submit" variant="primary" className="me-2">
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({ group_name: "", status: "" });
                    setEditId(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" variant="primary" className="me-2">
                  Submit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({ group_name: "", status: "" });
                    setErrors({});
                  }}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card>
      <hr className="text-danger" />
      <h4 className="bg-danger-subtle p-2 text-center">Vendor Group List</h4>
      <div className="d-flex justify-content-between mb-2">
        <div>
          <Button variant="success" className="me-2" onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button variant="danger" onClick={exportToPDF}>
            Export PDF
          </Button>
        </div>
        <div>
          <strong>Page {currentPage} of {totalPages}</strong>
        </div>
      </div>
      <Table striped bordered hover responsive className="shadow text-center">
        <thead>
          <tr>
            <th className="bg-dark text-white fw-bold">Group ID</th>
            <th className="bg-dark text-white fw-bold">Group Name</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.group_id}</td>
              <td>{item.group_name}</td>
              <td>
                <span className={`badge ${item.status === "1" ? "bg-success" : "bg-secondary"}`}>
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(item)} className="bi-pencil-fill">
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end mb-4">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="me-2"
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default VendorGroup;
