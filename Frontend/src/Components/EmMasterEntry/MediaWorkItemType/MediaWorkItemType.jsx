import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Alert, Card, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MediaWorkItemType = () => {
  const [formData, setFormData] = useState({
    item_type: "",
    work_type_id: "",
    media_type_id: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const formRef = useRef(null);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3080/api/mediaworkitemtype/get-mediaworkitemtype"
      );
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
    if (!formData.item_type) {
      newErrors.item_type = "Required";
    } else if (!/^[A-Za-z].*$/.test(formData.item_type)) {
      newErrors.item_type = "Must start with a Alphabet";
    }

    if (!formData.work_type_id) {
      newErrors.work_type_id = "Required";
    } else if (!/^\d+$/.test(formData.work_type_id)) {
      newErrors.work_type_id = "Invalid entry make sure Enter number (eg.- 01)";
    }
    if (!formData.media_type_id) {
      newErrors.media_type_id = "Required";
    } else if (!/^\d+$/.test(formData.media_type_id)) {
      newErrors.media_type_id =
        "Invalid entry make sure Enter number (eg.- 01)";
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
          `http://localhost:3080/api/mediaworkitemtype/update-mediaworkitemtype/${editId}`,
          formData
        );
        showAlert("Updated successfully");
      } else {
        const res = await axios.post(
          "http://localhost:3080/api/mediaworkitemtype/add-mediaworkitemtype",
          formData
        );
        showAlert(res.data);
      }
      fetchData();
      setFormData({
        item_type: "",
        work_type_id: "",
        media_type_id: "",
        status: "",
      });
      setErrors({});
      setEditId(null);
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setEditId(item.item_type_id);
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" });
    XLSX.utils.sheet_add_aoa(ws, [["Media Work Item Types"]], { origin: "A1" });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ItemTypes");
    XLSX.writeFile(wb, "MediaWorkItemTypes.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Media Work Item Types - Page " + currentPage, 14, 15);
    const currentPageData = paginatedData.map((item) => [
      item.item_type_id,
      item.item_type,
      item.work_type_id,
      item.media_type_id,
      item.status === "1" ? "Active" : "Inactive",
    ]);
    autoTable(doc, {
      startY: 20,
      head: [["ID", "Item Type", "Work Type", "Media Type", "Status"]],
      body: currentPageData,
    });
    doc.save(`MediaWorkItemTypes_Page${currentPage}.pdf`);
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">
        Media Work Item Type
      </h4>
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
            {["item_type", "work_type_id", "media_type_id", "status"].map(
              (field, idx) => (
                <Col md={3} key={idx} className="mb-3">
                  <Form.Group>
                    <Form.Label className="text-capitalize">
                      {field.replaceAll("_", " ")}
                    </Form.Label>
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
              )
            )}
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
                    setFormData({
                      item_type: "",
                      work_type_id: "",
                      media_type_id: "",
                      status: "",
                    });
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
                    setFormData({
                      item_type: "",
                      work_type_id: "",
                      media_type_id: "",
                      status: "",
                    });
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
      <h4 className="bg-danger-subtle p-2 text-center">Item Type List</h4>
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
          <strong>
            Page {currentPage} of {totalPages}
          </strong>
        </div>
      </div>
      <Table striped bordered hover responsive className="shadow text-center">
        <thead>
          <tr>
            <th className="bg-dark text-white fw-bold">Item Type ID</th>
            <th className="bg-dark text-white fw-bold">Item Type</th>
            <th className="bg-dark text-white fw-bold">Work Type ID</th>
            <th className="bg-dark text-white fw-bold">Media Type ID</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.item_type_id}</td>
              <td>{item.item_type}</td>
              <td>{item.work_type_id}</td>
              <td>{item.media_type_id}</td>
              <td>
                <span
                  className={`badge ${
                    item.status === "1" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {item.status === "1" ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="bi-pencil-fill fw-bold"
                >
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

export default MediaWorkItemType;
