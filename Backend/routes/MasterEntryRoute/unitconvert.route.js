const express = require("express");
const {
  getUnitConvert,
  getUnitConvertById,
  createUnitConvert,
  updateUnitConvert,
} = require("../../controllers/MastreEntryControler/unitconvert.controler");
// const VerifyToken=require("../middleware/auth.middleware.js");

const router = express.Router();
router.get("/get-unitconvert", getUnitConvert);
router.get("/get-unitconvert/:id", getUnitConvertById);
router.post("/add-unitconvert", createUnitConvert);
router.put("/update-unitconvert/:id", updateUnitConvert);

module.exports = router;
