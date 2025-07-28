const express = require("express");
const {
  getVendorCategory,
  getVendorCategoryById,
  createVendorCategory,
  updateVendorCategory,
} = require("../../controllers/EmMasterEntryControler/vendorcategory.controler");

const router = express.Router();
router.get("/get-vendorcategory", getVendorCategory);
router.get("/get-vendorcategory/:cate_id", getVendorCategoryById);
router.post("/add-vendorcategory", createVendorCategory);
router.put("/update-vendorcategory/:cate_id", updateVendorCategory);

module.exports = router;
