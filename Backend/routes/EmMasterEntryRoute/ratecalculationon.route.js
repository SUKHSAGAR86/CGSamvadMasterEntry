const express = require("express");
const {
  getRateCalculationOn,
  getRateCalculationOnById,
  createRateCalculationOn,
  updateRateCalculationOn,
} = require("../../controllers/EmMasterEntryControler/ratecalculationon.controler");

const router = express.Router();
router.get("/get-ratecalculationon", getRateCalculationOn);
router.get("/get-ratecalculationon/:id", getRateCalculationOnById);
router.post("/add-ratecalculationon", createRateCalculationOn);
router.put("/update-ratecalculationon/:id", updateRateCalculationOn);

module.exports = router;
