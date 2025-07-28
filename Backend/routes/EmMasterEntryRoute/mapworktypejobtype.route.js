const express = require("express");
const {
  getMapWorkTypeJobType,
  createMapWorkTypeJobType,
  updateMapWorkTypeJobType,
} = require("../../controllers/EmMasterEntryControler/mapworktypejobtype.controler");

const router = express.Router();
router.get("/get-mapworktypejobtype", getMapWorkTypeJobType);
router.post("/add-mapworktypejobtype", createMapWorkTypeJobType);
router.put("/update-mapworktypejobtype/:work_type_id/:old_job_type_id", updateMapWorkTypeJobType);
module.exports = router;
