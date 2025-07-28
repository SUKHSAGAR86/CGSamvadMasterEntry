const express = require("express");
const {
  getJobUnit,
  getJobUnitById,
  createJobUnit,
  updateJobUnit,
} = require("../../controllers/EmMasterEntryControler/jobunit.controler");

const router = express.Router();
router.get("/get-jobunit", getJobUnit);
router.get("/get-jobunit/:unit_id", getJobUnitById);
router.post("/add-jobunit", createJobUnit);
router.put("/update-jobunit/:unit_id", updateJobUnit);

module.exports = router;
