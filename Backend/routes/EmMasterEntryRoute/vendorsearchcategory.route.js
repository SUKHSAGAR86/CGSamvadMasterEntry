const express = require('express');
const { getVendorSearchCategory, getVendorSearchCategoryById, createVendorSearchCategory, updateVendorSearchCategory } = require('../../controllers/EmMasterEntryControler/vendorsearchcategory.controler');

const router = express.Router();
router.get("/get-vendorsearchcategory",getVendorSearchCategory);
router.get("/get-vendorsearchcategory/:cate_id", getVendorSearchCategoryById);
router.post("/add-vendorsearchcategory", createVendorSearchCategory);
router.put("/update-vendorsearchcategory/:cate_id", updateVendorSearchCategory); // Assuming the same function is used for update

module.exports = router;