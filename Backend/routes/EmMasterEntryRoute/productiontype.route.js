const express = require('express');
const { getProductionType, getProductionTypeById, updateProductionType, createProductionType } = require('../../controllers/EmMasterEntryControler/productiontype.controler.js');


const router= express.Router();
router.get("/get-productiontype", getProductionType);
router.get("/get-productiontype/:production_type_id", getProductionTypeById);
router.post("/add-productiontype",createProductionType);
router.put("/update-productiontype/:production_type_id",updateProductionType)

module.exports = router;