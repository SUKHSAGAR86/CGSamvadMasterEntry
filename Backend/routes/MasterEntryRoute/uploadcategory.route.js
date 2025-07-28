const express = require("express");
const {
  getUploadCategory,
  getUploadCategoryById,
  createUploadCategory,
  updateUploadCategory,
} = require("../../controllers/MastreEntryControler/uploadcategory.controler");
// const VerifyToken=require("../middleware/auth.middleware.js");

const router = express.Router();
router.get("/get-uploadcategory", getUploadCategory);
router.get("/get-uploadcategory/:cat_cd", getUploadCategoryById);
router.post("/add-uploadcategory", createUploadCategory);
router.put("/update-uploadcategory/:cat_cd", updateUploadCategory);

module.exports = router;
