const express = require("express");
const {
  getOfficeOfficer,
  getOfficeOfficerById,
  createOfficeOfficer,
  updateOfficeOfficer,
} = require("../../controllers/MastreEntryControler/officeOfficer.controler.js");
// const verifyToken=require("../middleware/auth.middleware.js")

const router = express.Router();
router.get("/get-officeofficer", getOfficeOfficer);
router.get("/get-officeofficer/:sno", getOfficeOfficerById);
router.post("/add-officeofficer", createOfficeOfficer);
router.put("/update-officeofficer/:sno", updateOfficeOfficer);
module.exports = router;
