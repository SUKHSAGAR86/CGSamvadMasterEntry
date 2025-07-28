const express=require("express");
const { getVendors, getVendorById, createVendor, updateVendor } = require("../../controllers/EmMasterEntryControler/vendor.controler");


const router=express.Router();
router.get("/get-vendor",getVendors);
router.get("/get-vendor/:vendor_id",getVendorById);
router.post("/add-vendor",createVendor);
router.put("/update-vendor/:vendor_id",updateVendor);

module.exports=router;