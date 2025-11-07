
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   Form,
//   Button,
//   Table,
//   Card,
//   Row,
//   Col,
//   Alert,
// } from "react-bootstrap";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const TimeBand = () => {
//   const [formData, setFormData] = useState({
//     media_type_id: "",
//     media_type: "",
//     time_band_from: "",
//     time_band_to: "",
//     status: "",
//   });
//   const [data, setData] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;
//   const formRef = useRef(null);

//   const showAlert = (message, variant = "success") => {
//     setAlert({ show: true, message, variant });
//     setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
//   };

//   const fetchData = async () => {
//     try {
//       const res = await axios.get("http://localhost:3080/api/timeband/get-timeband");
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const isValidTime = (time) => {
//     return /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(time);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { media_type_id, media_type, time_band_from, time_band_to, status } = formData;
//     if (!media_type_id || !media_type || !time_band_from || !time_band_to || !status) {
//       showAlert("All fields are required", "danger");
//       return;
//     }
//     if (!isValidTime(time_band_from) || !isValidTime(time_band_to)) {
//       showAlert("Time must be in 12-hour format (hh:mm AM/PM)", "danger");
//       return;
//     }

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:3080/api/timeband/update-timeband/${editId}`, formData);
//         showAlert("Updated successfully");
//       } else {
//         await axios.post("http://localhost:3080/api/timeband/add-timeband", formData);
//         showAlert("Created successfully");
//       }
//       setFormData({ media_type_id: "", media_type: "", time_band_from: "", time_band_to: "", status: "" });
//       setEditId(null);
//       fetchData();
//     } catch (err) {
//       showAlert("Error occurred", "danger");
//     }
//   };

//   const handleEdit = (item) => {
//     setFormData({
//       media_type_id: item.media_type_id,
//       media_type: item.media_type,
//       time_band_from: item.time_band_from,
//       time_band_to: item.time_band_to,
//       status: item.status,
//     });
//     setEditId(item.time_band_id);
//     setTimeout(() => {
//       formRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "TimeBands");
//     XLSX.writeFile(wb, "TimeBands.xlsx");
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [["Media Type ID", "Media Type", "From", "To", "Status"]],
//       body: data.map((item) => [
//         item.media_type_id,
//         item.media_type,
//         item.time_band_from,
//         item.time_band_to,
//         item.status === "1" ? "Active" : "Inactive",
//       ]),
//     });
//     doc.save("TimeBands.pdf");
//   };

//   const totalPages = Math.ceil(data.length / recordsPerPage);
//   const paginatedData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

//   return (
//     <div className="container mt-4">
//       <div ref={formRef}></div>
//       <h4 className="text-center mb-4 bg-primary-subtle p-2">Time Band Master</h4>

//       {alert.show && (
//         <Alert
//           variant={alert.variant}
//           className="text-center position-fixed top-50 start-50 translate-middle z-3 w-50 shadow"
//         >
//           {alert.message}
//         </Alert>
//       )}

//       <Card className="p-3 mb-4 shadow">
//         <Form onSubmit={handleSubmit}>
//           <Row>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Media Type ID</Form.Label>
//                 <Form.Control
//                   name="media_type_id"
//                   value={formData.media_type_id}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Media Type</Form.Label>
//                 <Form.Control
//                   name="media_type"
//                   value={formData.media_type}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//               <Form.Group>
//                 <Form.Label>Time From</Form.Label>
//                 <Form.Control
//                   name="time_band_from"
//                   value={formData.time_band_from}
//                   onChange={handleChange}
//                   placeholder="hh:mm AM/PM"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//               <Form.Group>
//                 <Form.Label>Time To</Form.Label>
//                 <Form.Control
//                   name="time_band_to"
//                   value={formData.time_band_to}
//                   onChange={handleChange}
//                   placeholder="hh:mm AM/PM"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//               <Form.Group>
//                 <Form.Label>Status</Form.Label>
//                 <Form.Select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Status</option>
//                   <option value="1">Active</option>
//                   <option value="0">Inactive</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>
//           <div className="text-end mt-3">
//             {editId ? (
//               <>
//                 <Button type="submit" variant="primary" className="me-2">
//                   Update
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => {
//                     setFormData({ media_type_id: "", media_type: "", time_band_from: "", time_band_to: "", status: "" });
//                     setEditId(null);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button type="submit" variant="primary" className="me-2">
//                   Submit
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() =>
//                     setFormData({ media_type_id: "", media_type: "", time_band_from: "", time_band_to: "", status: "" })
//                   }
//                 >
//                   Clear
//                 </Button>
//               </>
//             )}
//           </div>
//         </Form>
//       </Card>

//       <div className="d-flex justify-content-between mb-2">
//         <div>
//           <Button variant="success" className="me-2" onClick={exportToExcel}>
//             Export Excel
//           </Button>
//           <Button variant="danger" onClick={exportToPDF}>
//             Export PDF
//           </Button>
//         </div>
//         <div>
//           <strong>
//             Page {currentPage} of {totalPages}
//           </strong>
//         </div>
//       </div>

//       <Table striped bordered hover responsive className="shadow text-center">
//         <thead>
//           <tr>
//             <th className="bg-dark text-white fw-bold">Media Type ID</th>
//             <th className="bg-dark text-white fw-bold">Media Type</th>
//             <th className="bg-dark text-white fw-bold">Time From</th>
//             <th className="bg-dark text-white fw-bold">Time To</th>
//             <th className="bg-dark text-white fw-bold">Status</th>
//             <th className="bg-dark text-white fw-bold">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.map((item, index) => (
//             <tr key={index}>
//               <td>{item.media_type_id}</td>
//               <td>{item.media_type}</td>
//               <td>{item.time_band_from}</td>
//               <td>{item.time_band_to}</td>
//               <td>
//                 <span className={`badge ${item.status === "1" ? "bg-success" : "bg-secondary"}`}>
//                   {item.status === "1" ? "Active" : "Inactive"}
//                 </span>
//               </td>
//               <td>
//                 <Button variant="warning" size="sm" onClick={() => handleEdit(item)}>
//                   Edit
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <div className="d-flex justify-content-end">
//         <Button
//           variant="secondary"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((p) => p - 1)}
//           className="me-2"
//         >
//           Prev
//         </Button>
//         <Button
//           variant="secondary"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((p) => p + 1)}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default TimeBand;


import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Table,
  Card,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TimeBand = () => {
  const [formData, setFormData] = useState({
    media_type_id: "",
    media_type: "",
    time_band_from: "",
    time_band_to: "",
    status: "",
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
      const res = await axios.get("http://localhost:3080/api/timeband/get-timeband");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validate = () => {
    const newErrors = {};

 const mediaTypeId = formData.media_type_id.trim();
if (!mediaTypeId) {
  newErrors.media_type_id = "Media Type ID is required";
} else if (!/^\d+$/.test(mediaTypeId)) {
  newErrors.media_type_id = "Only numeric values are allowed";
}

    if (!formData.media_type) {
      newErrors.media_type = "Media Type is required";
    } else if (!/^[A-Za-z]/.test(formData.media_type)) {
      newErrors.media_type = "First character must be an alphabet";
    }

    if (!formData.time_band_from) {
      newErrors.time_band_from = "Time From is required";
    }

    if (!formData.time_band_to) {
      newErrors.time_band_to = "Time To is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showAlert("Please fix validation errors", "danger");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:3080/api/timeband/update-timeband/${editId}`, formData);
        showAlert("Updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/timeband/add-timeband", formData);
        showAlert("Created successfully");
      }
      setFormData({
        media_type_id: "",
        media_type: "",
        time_band_from: "",
        time_band_to: "",
        status: "",
      });
      setEditId(null);
      setErrors({});
      fetchData();
    } catch (err) {
      showAlert(" enter valid Media Type ID (eg.- 01-99) ", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      media_type_id: item.media_type_id,
      media_type: item.media_type,
      time_band_from: item.time_band_from,
      time_band_to: item.time_band_to,
      status: item.status,
    });
    setEditId(item.time_band_id);
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "TimeBand");
//     XLSX.writeFile(wb, "TimeBand.xlsx");
//   };


const exportToExcel = () => {
  // Prepare data with header row
  const title = [["Time Band Master"]]; // merged title row
  const headers = [["Media Type ID", "Media Type", "From", "To", "Status"]];
  const body = paginatedData.map((item) => [
    item.media_type_id,
    item.media_type,
    item.time_band_from,
    item.time_band_to,
    item.status === "1" ? "Active" : "Inactive",
  ]);

  const allRows = [...title, ...headers, ...body];

  const ws = XLSX.utils.aoa_to_sheet(allRows);

  // Merge cells for title
  const mergeRange = { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }; // A1 to E1
  ws["!merges"] = [mergeRange];
  ws["A1"].s = { font: { bold: true } }; // optional style

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TimeBand");
  XLSX.writeFile(wb, "TimeBand_Page" + currentPage + ".xlsx");
};

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [["Media Type ID", "Media Type", "From", "To", "Status"]],
//       body: data.map((item) => [
//         item.media_type_id,
//         item.media_type,
//         item.time_band_from,
//         item.time_band_to,
//         item.status === "1" ? "Active" : "Inactive",
//       ]),
//     });
//     doc.save("TimeBand.pdf");
//   };


const exportToPDF = () => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(14);
  doc.text("Time Band List", 14, 15); // (text, x, y)

  // Add table below the title
  autoTable(doc, {
    startY: 20, // start below the title
    head: [["Media Type ID", "Media Type", "From", "To", "Status"]],
    body: paginatedData.map((item) => [
      item.media_type_id,
      item.media_type,
      item.time_band_from,
      item.time_band_to,
      item.status === "1" ? "Active" : "Inactive",
    ]),
  });

  doc.save("TimeBand_Page" + currentPage + ".pdf");
};


  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Time Band Master</h4>

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
            <Col md={4}>
              <Form.Group>
                <Form.Label>Media Type ID</Form.Label>
                <Form.Control
                  name="media_type_id"
                  value={formData.media_type_id}
                  onChange={handleChange}
                  isInvalid={!!errors.media_type_id}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.media_type_id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Media Type</Form.Label>
                <Form.Control
                  name="media_type"
                  value={formData.media_type}
                  onChange={handleChange}
                  isInvalid={!!errors.media_type}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.media_type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Time From</Form.Label>
                <Form.Control
                  type="time"
                  name="time_band_from"
                  value={formData.time_band_from}
                  onChange={handleChange}
                  isInvalid={!!errors.time_band_from}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.time_band_from}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4} className="mt-3">
              <Form.Group>
                <Form.Label>Time To</Form.Label>
                <Form.Control
                  type="time"
                  name="time_band_to"
                  value={formData.time_band_to}
                  onChange={handleChange}
                  isInvalid={!!errors.time_band_to}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.time_band_to}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4} className="mt-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  isInvalid={!!errors.status}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.status}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end mt-3">
            {editId ? (
              <>
                <Button type="submit" variant="primary" className="me-2">
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setFormData({
                      media_type_id: "",
                      media_type: "",
                      time_band_from: "",
                      time_band_to: "",
                      status: "",
                    });
                    setErrors({});
                    setEditId(null);
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
                  onClick={() =>
                    setFormData({
                      media_type_id: "",
                      media_type: "",
                      time_band_from: "",
                      time_band_to: "",
                      status: "",
                    })
                  }
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card>

      <hr  className="text-danger mb-5"/>
      <h4 className="bg-danger-subtle p-2 text-center mb-2">Time Band List</h4>

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
            
            <th className="bg-dark text-white fw-bold">Media Type ID</th>
            <th className="bg-dark text-white fw-bold">Media Type</th>
             <th className="bg-dark text-white fw-bold">Time Band ID</th>
            <th className="bg-dark text-white fw-bold">Time From</th>
            <th className="bg-dark text-white fw-bold">Time To</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.media_type_id}</td>
              <td>{item.media_type}</td>
              <td>{item.time_band_id}</td>
              <td>{item.time_band_from}</td>
              <td>{item.time_band_to}</td>
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

      <div className="d-flex justify-content-end">
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

export default TimeBand;
