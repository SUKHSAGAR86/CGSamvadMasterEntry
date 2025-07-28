const express = require("express");
const {
  getMapVendorGroups,
  getMapVendorGroupById,
  createMapVendorGroup,
  updateMapVendorGroup,
} = require("../../controllers/EmMasterEntryControler/mapvendorgroup.controler");

const router = express.Router();
router.get("/get-mapvendorgroup", getMapVendorGroups);
router.get("/get-mapvendorgroup/:vendor_id", getMapVendorGroupById);
router.post("/add-mapvendorgroup", createMapVendorGroup);
router.put("/update-mapvendorgroup/:vendor_id/:group_id", updateMapVendorGroup);

module.exports = router;
