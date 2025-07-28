const express = require("express");
const {
  getOfficer,
  getOfficerById,
  createOfficer,
  updateOfficer,
} = require("../../controllers/MastreEntryControler/officer.controler");

// const VerifyToken=require("../middleware/auth.middleware.js")

const router = express.Router();
router.get("/get-officer", getOfficer);
router.get("/get-officer/:id", getOfficerById);
router.post("/add-officer", createOfficer);
router.put("/update-officer/:id", updateOfficer);

module.exports = router;
