const express = require('express');
const { getMapWorkTypeMediaType, createMapWorkTypeMediaType, getMapWorkTypeMediaTypeById, updateMapWorkTypeMediaType } = require('../../controllers/EmMasterEntryControler/mapworktypemediatype.controler');

const router = express.Router();
router.get("/get-mapworktypemediatype",getMapWorkTypeMediaType);
router.get("/get-mapworktypemediatype/:work_type_id", getMapWorkTypeMediaTypeById);
router.post("/add-mapworktypemediatype", createMapWorkTypeMediaType);
router.put("/update-mapworktypemediatype/:work_type_id/:old_media_type_id",updateMapWorkTypeMediaType);
module.exports = router;