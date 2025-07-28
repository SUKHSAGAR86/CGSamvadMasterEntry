
const express = require("express"); 
const { getMapJobTypeProductionType,getMapJobTypeProductionTypeById, createMapJobTypeProductionType } = require("../../controllers/EmMasterEntryControler/mapjobtypeproductiontype.controler");

const router=express.Router();
router.get("/get-jobtypeproductiontype",getMapJobTypeProductionType)
router.get("/get-jobtypeproductiontype/:production_type_id", getMapJobTypeProductionTypeById);  
router.post("/add-jobtypeproductiontype",createMapJobTypeProductionType);
router.put("/update-jobtypeproductiontype/:production_type_id",createMapJobTypeProductionType);

module.exports=router;