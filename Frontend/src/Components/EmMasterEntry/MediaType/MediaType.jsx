import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button, Form, Table, Alert, Card, Row, Col } from "react-bootstrap";

const MediaType = () => {
  const [formData, setFormData] = useState({
    media_type: "",
    media_type_H: "",
    status: "",
  });

  const [mediaTypes, setMediaTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const alertRef = useRef();

  useEffect(() => {
    fetchMediaTypes();
    // eslint-disable-next-line
  }, []);

  const fetchMediaTypes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3080/api/mediatype/get-mediatype"
      );
      setMediaTypes(res.data);
    } catch {
      showAlert("Failed to fetch media types", "danger");
    }
  };

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { media_type, media_type_H } = formData;

    if (!media_type || !media_type_H) {
      showAlert("All fields are required", "warning");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3080/api/mediatype/update-mediatype/${editId}`,
          formData
        );
        showAlert("Media type updated successfully");
      } else {
        await axios.post(
          "http://localhost:3080/api/mediatype/add-mediatype",
          formData
        );
        showAlert("Media type created successfully");
      }

      fetchMediaTypes();
      setFormData({ media_type: "", media_type_H: "", status: "" });
      setEditId(null);
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Something went wrong",
        "danger"
      );
    }
  };

  const handleEdit = (item) => {
    setFormData({
      media_type: item.media_type,
      media_type_H: item.media_type_H,
      status: item.status,
    });
    setEditId(item.media_type_id);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(mediaTypes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MediaTypes");
    XLSX.writeFile(wb, "MediaTypes.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Media Type", "Media Type (Hindi)", "Status"]],
      body: mediaTypes.map((item) => [
        item.media_type_id,
        item.media_type,
        item.media_type_H,
        item.status === "1" ? "Active" : "Inactive",
      ]),
    });
    doc.save("MediaTypes.pdf");
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mediaTypes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mediaTypes.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <h4 className="text-center mb-4 bg-success-subtle p-2">
        Media Type Master
      </h4>

      {alert.show && (
        <div
          ref={alertRef}
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: "40%",
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          <Alert variant={alert.variant} className="text-center w-50">
            {alert.message}
          </Alert>
        </div>
      )}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Media Type (English)</Form.Label>
                <Form.Control
                  type="text"
                  name="media_type"
                  value={formData.media_type}
                  onChange={handleChange}
                />
              </Col>

              <Col md={4}>
                <Form.Label>Media Type (Hindi)</Form.Label>
                <Form.Control
                  type="text"
                  name="media_type_H"
                  value={formData.media_type_H}
                  onChange={handleChange}
                />
              </Col>

              <Col md={4}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">----Select----</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Select>
              </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button type="submit" variant="primary">
                {editId ? "Update" : "Submit"}
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={() => {
                  setFormData({
                    media_type: "",
                    media_type_H: "",
                    status: "1",
                  });
                  setEditId(null);
                }}
              >
                Clear
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <hr />
      <div className="mt-5">
        <h5 className="text-center fw-bold bg-danger-subtle p-2">
          Media Type List
        </h5>

        <div className="d-flex justify-content-end mt-4 mb-2 gap-2">
          <button
            onClick={handleExportExcel}
            className="btn btn-success btn-sm"
          >
            <i className="bi bi-file-earmark-excel-fill me-1"></i>Export Excel
          </button>
          <button onClick={handleExportPDF} className="btn btn-danger btn-sm">
            <i className="bi bi-file-earmark-pdf-fill me-1"></i>Export PDF
          </button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th className="bg-dark text-white fw-bold">ID</th>
              <th className="bg-dark text-white fw-bold">Media Type</th>
              <th className="bg-dark text-white fw-bold">Media Type (Hindi)</th>
              <th className="bg-dark text-white fw-bold">Status</th>
              <th className="bg-dark text-white fw-bold">Action</th>
            </tr>
          </thead>
          <tbody className=" text-center">
            {currentItems.map((item) => (
              <tr key={item.media_type_id}>
                <td>{item.media_type_id}</td>
                <td>{item.media_type}</td>
                <td>{item.media_type_H}</td>
                <td>
                  <span
                    className={`badge rounded-pill px-3 py-2 fw-semibold ${
                      item.status === "1"
                        ? "bg-success text-white"
                        : "bg-secondary text-white"
                    }`}
                  >
                    {item.status === "1" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div
                    onClick={() => handleEdit(item)}
                    className="btn btn-warning text-dark bi-pencil-fill"
                  >
                    Edit
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div>
        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(1)}>
                  First
                </button>
              </li>
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Prev
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                >
                  Next
                </button>
              </li>
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  Last
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default MediaType;
