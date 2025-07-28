const express = require("express");
const {
  getJobTypes,
  getJobTypeById,
  createJobType,
  updateJobType,
} = require("../../controllers/EmMasterEntryControler/jobtype.controler");

const router = express.Router();
router.get("/get-jobtype", getJobTypes);
router.get("/get-jobtype/:job_type_id", getJobTypeById);
router.post("/add-jobtype", createJobType);
router.put("/update-jobtype/:job_type_id", updateJobType);

module.exports = router;
