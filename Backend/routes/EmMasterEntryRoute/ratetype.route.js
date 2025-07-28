const express = require('express');


const { getRateType, getRateTypeById, createRateType, updateRateType } = require('../../controllers/EmMasterEntryControler/ratetype.controler');



const router = express.Router();

router.get("/get-ratetype",getRateType);
router.get("/get-ratetype/:rate_type_id",getRateTypeById);
router.post("/add-ratetype",createRateType);
router.put("/update-ratetype/:rate_type_id",updateRateType);


module.exports = router;