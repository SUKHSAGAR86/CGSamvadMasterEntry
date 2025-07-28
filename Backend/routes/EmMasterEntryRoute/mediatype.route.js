const express = require('express');
const { getMediaType, getMediaTypeById, createMediaType, updateMediaType } = require('../../controllers/EmMasterEntryControler/mediatype.controler');


const router = express.Router();  
router.get("/get-mediatype",getMediaType);
router.get("/get-mediatype/:media_type_id",getMediaTypeById);
router.post("/add-mediatype",createMediaType); 
router.put("/update-mediatype/:media_type_id",updateMediaType);

module.exports = router;

