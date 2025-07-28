const express = require("express");
const {
  getOfficerLevel,
  getOfficerLevelById,
  createOfficerLevel,
  updateOfficerLevel,
} = require("../../controllers/MastreEntryControler/officerlevel.controler");

// const VerifyToken=require("../middleware/auth.middleware.js")

const router = express.Router();
router.get("/get-officerlevel", getOfficerLevel);
router.get("/get-officerlevel/:id", getOfficerLevelById);
router.post("/add-officerlevel", createOfficerLevel);
router.put("/update-officerlevel/:id", updateOfficerLevel);

module.exports = router;
