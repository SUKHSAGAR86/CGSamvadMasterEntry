const express = require("express");
const {
  getEmployee,
  getEmployeeById,
  createEmployee,
  updateEmlpoyee,
} = require("../../controllers/MastreEntryControler/employee.controler");
// const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();
router.get("/get-employee", getEmployee);
router.get("/get-employee/:id", getEmployeeById);
router.post("/add-employee", createEmployee);
router.put("/update-employee/:id", updateEmlpoyee);

module.exports = router;
