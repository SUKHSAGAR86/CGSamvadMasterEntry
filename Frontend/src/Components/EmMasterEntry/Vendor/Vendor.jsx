
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const Vendor = () => {
//   const [formData, setFormData] = useState({
//     vendor_name: "",
//     media_type_id: "",
//     media_type: "",
//     owner_name: "",
//     contact_no: "",
//     email_id: "",
//     status: "",
//     is_eligible_for_gst: "",
//     is_gst_verified_by_admin: "",
//     gst_approved: "",
//     gst_rejected: "",
//     gst_reject_remark: "",
//     GST_legalName: "",
//     GST_Trade_Name: "",
//     GST_number: "",
//     GST_StateID: "",
//     GST_StateText: "",
//     GST_DateOfRegistration: "",
//     GST_DateOfIssue: "",
//     GST_TaxpayerType: "",
//     State_Code: "",
//     District_Code: "",
//     State_Text: "",
//     District_Text: "",
//     Area_Code: "",
//     Area_Text: "",
//     search_cate_id: "",
//     search_category: "",
//     entry_by_user_id: "",
//     entry_by_user_name: "",
//     modify_by_user_id: "",
//     modify_by_user_name: "",
//   });

//   const [errors, setErrors] = useState({});
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
//       const res = await axios.get("http://localhost:3080/api/vendor/get-vendor");
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const validate = () => {
//     const newErrors = {};
//     const required = [
//       "media_type_id",
//       "media_type",
//       "vendor_name",
//       "contact_no",
//       "status",
//       "email_id",
//       "District_Code",
//       "District_Text",
//       "State_Text",
//       "State_Code",
//     ];
//     required.forEach((field) => {
//       if (!formData[field]) newErrors[field] = "Required";
//     });

//     if (!/^[0-9]+$/.test(formData.media_type_id)) newErrors.media_type_id = "Digits only";
//     if (!/^[0-9]+$/.test(formData.District_Code)) newErrors.District_Code = "Digits only";
//     if (!/^[A-Za-z ]+$/.test(formData.media_type)) newErrors.media_type = "Alphabets only";
//     if (!/^[A-Za-z ]+$/.test(formData.vendor_name)) newErrors.vendor_name = "Alphabets only";
//     if (!/^[A-Za-z ]+$/.test(formData.District_Text)) newErrors.District_Text = "Alphabets only";
//     if (!/^[A-Za-z ]+$/.test(formData.State_Text)) newErrors.State_Text = "Alphabets only";
//     if (!/^\d{10}$/.test(formData.contact_no)) newErrors.contact_no = "Format:1234567890";
//     if (formData.email_id && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id))
//       newErrors.email_id = "Invalid email";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       showAlert("Validation errors exist", "danger");
//       return;
//     }

//     const payload = { ...formData };
//     if (!payload.GST_DateOfRegistration) payload.GST_DateOfRegistration = null;
//     if (!payload.GST_DateOfIssue) payload.GST_DateOfIssue = null;

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:3080/api/vendor/update-vendor/${editId}`, payload);
//         showAlert("Updated successfully");
//       } else {
//         await axios.post("http://localhost:3080/api/vendor/add-vendor", payload);
//         showAlert("Created successfully");
//       }
//       fetchData();
//       setFormData({ ...Object.fromEntries(Object.keys(formData).map((k) => [k, ""])) });
//       setErrors({});
//       setEditId(null);
//     } catch (err) {
//       showAlert("Error occurred", "danger");
//     }
//   };

//   const handleEdit = (item) => {
//     setFormData({ ...item });
//     setEditId(item.vendor_id);
//     window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
//   };

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Vendors");
//     XLSX.writeFile(wb, "Vendors.xlsx");
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(14);
//     doc.text(`Vendor List - Page ${currentPage}`, 14, 15);

//     autoTable(doc, {
//       startY: 20,
//       head: [["Vendor ID","Media ID", "Vendor Name", "Media Type", "Status","Contact","Email"]],
//       body: paginatedData.map((item) => [
//         item.vendor_id,
//         item.media_type_id,
//         item.vendor_name,
//         item.media_type,
//         item.status === 1 ? "Active" : "Inactive",
//         item.contact_no,
//         item.email_id,
//       ]),
//     });

//     doc.save(`Vendors_Page${currentPage}.pdf`);
//   };

//   const totalPages = Math.ceil(data.length / recordsPerPage);
//   const paginatedData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

//   return (
//     <div className="container mt-4">
//       <h4 className="text-center mb-4 bg-primary-subtle p-2">Vendor Master</h4>
//       {alert.show && (
//         <Alert
//           variant={alert.variant}
//           className="text-center position-fixed top-50 start-50 translate-middle z-3 w-50 shadow"
//         >
//           {alert.message}
//         </Alert>
//       )}
//       <Card className="p-3 mb-4 shadow" ref={formRef}>
//         <Form onSubmit={handleSubmit}>
//           <Row>
//             {Object.keys(formData).map((field, idx) => (
//               <Col md={4} key={idx} className="mb-3">
//                 <Form.Group>
//                   <Form.Label className="text-capitalize">{field.replaceAll("_", " ")}</Form.Label>
//                   {field === "status" || field.startsWith("is_") || field.startsWith("gst_") ? (
//                     <Form.Control
//                       as="select"
//                       name={field}
//                       value={formData[field] || ""}
//                       onChange={handleChange}
//                       isInvalid={!!errors[field]}
//                     >
//                       <option value="">Select</option>
//                       {field === "status" ? (
//                         <>
//                           <option value="1">Active</option>
//                           <option value="0">Inactive</option>
//                         </>
//                       ) : (
//                         <>
//                           <option value="Y">Yes</option>
//                           <option value="N">No</option>
//                         </>
//                       )}
//                     </Form.Control>
//                   ) : (
//                     <Form.Control
//                       type={field.toLowerCase().includes("date") ? "date" : "text"}
//                       name={field}
//                       value={formData[field] || ""}
//                       onChange={handleChange}
//                       isInvalid={!!errors[field]}
//                     />
//                   )}
//                   {errors[field] && (
//                     <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
//                   )}
//                 </Form.Group>
//               </Col>
//             ))}
//           </Row>
//           <div className="text-end">
//             {editId ? (
//               <>
//                 <Button type="submit" variant="primary" className="me-2">
//                   Update
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => {
//                     setFormData({ ...Object.fromEntries(Object.keys(formData).map((k) => [k, ""])) });
//                     setEditId(null);
//                     setErrors({});
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
//                   onClick={() => {
//                     setFormData({ ...Object.fromEntries(Object.keys(formData).map((k) => [k, ""])) });
//                     setErrors({});
//                   }}
//                 >
//                   Clear
//                 </Button>
//               </>
//             )}
//           </div>
//         </Form>
//       </Card>
//       <hr className="text-danger" />
//       <h4 className="bg-danger-subtle p-2 text-center">Vendor List</h4>
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
//             <th>Vendor ID</th>
//             <th>Vendor Name</th>
//             <th>Media Type</th>
//             <th>Status</th>
//             <th>Edit</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.map((item, index) => (
//             <tr key={index}>
//               <td>{item.vendor_id}</td>
//               <td>{item.vendor_name}</td>
//               <td>{item.media_type}</td>
//               <td>
//                 <span className={`badge ${item.status === 1 ? "bg-success" : "bg-secondary"}`}>
//                   {item.status === 1 ? "Active" : "Inactive"}
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

// export default Vendor;


import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Vendor = () => {
  const [formData, setFormData] = useState({
    vendor_name: "",
    media_type_id: "",
    media_type: "",
    owner_name: "",
    contact_no: "",
    email_id: "",
    status: "",
    is_eligible_for_gst: "",
    is_gst_verified_by_admin: "",
    gst_approved: "",
    gst_rejected: "",
    gst_reject_remark: "",
    GST_legalName: "",
    GST_Trade_Name: "",
    GST_number: "",
    GST_StateID: "",
    GST_StateText: "",
    GST_DateOfRegistration: "",
    GST_DateOfIssue: "",
    GST_TaxpayerType: "",
    State_Code: "",
    District_Code: "",
    State_Text: "",
    District_Text: "",
    Area_Code: "",
    Area_Text: "",
    search_cate_id: "",
    search_category: "",
    entry_date: "",
    entry_time: "",
    ip_address: "",
    entry_by_user_id: "",
    entry_by_user_name: "",
    modify_date: "",
    modify_time: "",
    modify_ip_address: "",
    modify_by_user_id: "",
    modify_by_user_name: "",
  });

  const skipFields = [
    "search_cate_id",
    "search_category",
    "entry_date",
    "entry_time",
    "ip_address",
    "entry_by_user_id",
    "entry_by_user_name",
    "modify_date",
    "modify_time",
    "modify_ip_address",
    "modify_by_user_id",
    "modify_by_user_name",
  ];

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
      const res = await axios.get("http://localhost:3080/api/vendor/get-vendor");
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
    const required = [
      "media_type_id",
      "media_type",
      "vendor_name",
      "contact_no",
      "status",
      "email_id",
      "District_Code",
      "District_Text",
      "State_Text",
      "State_Code",
    ];
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = "Required";
    });

    if (!/^[0-9]+$/.test(formData.media_type_id)) newErrors.media_type_id = "Digits only";
    if (!/^[0-9]+$/.test(formData.District_Code)) newErrors.District_Code = "Digits only";
    if (!/^[A-Za-z ]+$/.test(formData.media_type)) newErrors.media_type = "Alphabets only";
    if (!/^[A-Za-z ]+$/.test(formData.vendor_name)) newErrors.vendor_name = "Alphabets only";
    if (!/^[A-Za-z ]+$/.test(formData.District_Text)) newErrors.District_Text = "Alphabets only";
    if (!/^[A-Za-z ]+$/.test(formData.State_Text)) newErrors.State_Text = "Alphabets only";
    if (!/^\d{10}$/.test(formData.contact_no)) newErrors.contact_no = "Format:1234567890";
    if (formData.email_id && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id))
      newErrors.email_id = "Invalid email";
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
      showAlert("Validation errors exist", "danger");
      return;
    }

    // Build payload excluding audit/skip fields
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([key]) => !skipFields.includes(key))
    );

    // Auto-generate entry/modify metadata
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const formatDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const ip_address = ""; // placeholder
    const currentUser = { id: "", name: "" }; // placeholder

    if (!payload.GST_DateOfRegistration) payload.GST_DateOfRegistration = null;
    if (!payload.GST_DateOfIssue) payload.GST_DateOfIssue = null;

    if (editId) {
      payload.modify_date = formatDate(now);
      payload.modify_time = formatTime(now);
      payload.modify_ip_address = ip_address;
      payload.modify_by_user_id = currentUser.id;
      payload.modify_by_user_name = currentUser.name;
    } else {
      payload.entry_date = formatDate(now);
      payload.entry_time = formatTime(now);
      payload.ip_address = ip_address;
      payload.entry_by_user_id = currentUser.id;
      payload.entry_by_user_name = currentUser.name;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:3080/api/vendor/update-vendor/${editId}`, payload);
        showAlert("Updated successfully");
      } else {
        await axios.post("http://localhost:3080/api/vendor/add-vendor", payload);
        showAlert("Created successfully");
      }
      fetchData();
      setFormData({ ...Object.fromEntries(Object.keys(formData).map((k) => [k, ""])) });
      setErrors({});
      setEditId(null);
    } catch (err) {
      showAlert("Error occurred", "danger");
    }
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setEditId(item.vendor_id);
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, "Vendors.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Vendor List - Page ${currentPage}`, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Vendor ID", "Vendor Name", "Media Type", "Status", "Contact", "Email"]],
      body: paginatedData.map((item) => [
        item.vendor_id,
        item.vendor_name,
        item.media_type,
        item.status === 1 ? "Active" : "Inactive",
        item.contact_no,
        item.email_id,
      ]),
    });
    doc.save(`Vendors_Page${currentPage}.pdf`);
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4 bg-primary-subtle p-2">Vendor Master</h4>
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
            {Object.keys(formData).map((field, idx) => {
              if (skipFields.includes(field)) return null;
              return (
                <Col md={4} key={idx} className="mb-3">
                  <Form.Group>
                    <Form.Label className="text-capitalize">{field.replaceAll("_", " ")}</Form.Label>
                    {field === "status" || field.startsWith("is_") || field.startsWith("gst_") ? (
                      <Form.Control
                        as="select"
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        isInvalid={!!errors[field]}
                      >
                        <option value="">Select</option>
                        {field === "status" ? (
                          <>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </>
                        ) : (
                          <>
                            <option value="Y">Yes</option>
                            <option value="N">No</option>
                          </>
                        )}
                      </Form.Control>
                    ) : (
                      <Form.Control
                        type={field.toLowerCase().includes("date") ? "date" : "text"}
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        isInvalid={!!errors[field]}
                      />
                    )}
                    {errors[field] && (
                      <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              );
            })}
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
                    setFormData({ ...Object.fromEntries(Object.keys(formData).map((k) => [k, ""])) });
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
                    setFormData({ ...Object.fromEntries(Object.keys(formData).map((k) => [k, ""])) });
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
      <h4 className="bg-danger-subtle p-2 text-center">Vendor List</h4>
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
            <th className="bg-dark text-white fw-bold">Vendor ID</th>
            <th className="bg-dark text-white fw-bold">Vendor Name</th>
            <th className="bg-dark text-white fw-bold">Media Type</th>
            <th className="bg-dark text-white fw-bold">Status</th>
            <th className="bg-dark text-white fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.vendor_id}</td>
              <td>{item.vendor_name}</td>
              <td>{item.media_type}</td>
              <td>
                <span className={`badge ${item.status === 1 ? "bg-success" : "bg-secondary"}`}>
                  {item.status === 1 ? "Active" : "Inactive"}
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

export default Vendor;
