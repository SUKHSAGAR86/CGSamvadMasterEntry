const express = require('express');
const { getWorkType, getWorkTypeById, createWorkType, updateWorkType } = require('../../controllers/EmMasterEntryControler/worktype.controler');


const router = express.Router();
router.get("/get-worktype",getWorkType);
router.get("/get-worktype/:work_type_id", getWorkTypeById);
router.post("/add-worktype",createWorkType);
router.put("/update-worktype/:work_type_id",updateWorkType);

module.exports = router;    