const express = require("express");
const {
  getOfficeLevel,
  getOfficeLevelById,
  createOfficeLevel,
  updateOfficeLevel,
} = require("../../controllers/MastreEntryControler/officelevel.controler");
// const verifyToken=require("../middleware/auth.middleware.js")

const router = express.Router();
router.get("/get-officelevel", getOfficeLevel);
router.get("/get-officelevel/:id", getOfficeLevelById);
router.post("/add-officelevel", createOfficeLevel);
router.put("/update-officelevel/:id", updateOfficeLevel);

module.exports = router;
