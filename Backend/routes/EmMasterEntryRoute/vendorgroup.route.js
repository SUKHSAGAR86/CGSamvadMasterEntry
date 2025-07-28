const express=require("express");

const { getVendorGroups, getVendorGroupById, createVendorGroup, updateVendorGroup } = require("../../controllers/EmMasterEntryControler/vendorgroup.controler.js");

const router=express.Router();
router.get("/get-vendorgroup",getVendorGroups);
router.get("/get-vendorgroup/:id",getVendorGroupById);
router.post("/add-vendorgroup",createVendorGroup);
router.put("/update-vendorgroup/:group_id",updateVendorGroup)

module.exports=router;