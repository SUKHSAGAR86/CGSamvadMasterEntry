const express=require("express");
const { getTimeBands, getTimeBandById, createTimeBand, updateTimeBand } = require("../../controllers/EmMasterEntryControler/timeband.controler");

const router=express.Router();
router.get("/get-timeband",getTimeBands);
router.get("/get-timeband/:time_band_id", getTimeBandById);
router.post("/add-timeband",createTimeBand);
router.put("/update-timeband/:time_band_id", updateTimeBand);

module.exports=router;