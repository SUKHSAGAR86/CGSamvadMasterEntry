const express = require("express");

const {
  getMapVendorCategory,
  getMapVendorCategoryById,
  createMapVendorCategory,
  updateMapVendorCategory,
} = require("../../controllers/EmMasterEntryControler/mapvendorcategory.controler");

const router = express.Router();
router.get("/get-mapvendorcategory", getMapVendorCategory);
router.get("/get-mapvendorcategory/:media_type_id", getMapVendorCategoryById);
router.post("/add-mapvendorcategory", createMapVendorCategory);
router.put("/update-mapvendorcategory/:media_type_id", updateMapVendorCategory);

module.exports = router;
