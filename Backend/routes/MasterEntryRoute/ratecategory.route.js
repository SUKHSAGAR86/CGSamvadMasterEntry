const express = require("express");
// const VerifyToken=require("../middleware/auth.middleware.js");

const {
  getRateCategory,
  getRateCategoryById,
  createRateCategory,
  updateRateCategory,
} = require("../../controllers/MastreEntryControler/ratecategory.controler");

const router = express.Router();
router.get("/get-ratecategory", getRateCategory);
router.get("/get-ratecategory/:id", getRateCategoryById);
router.post("/add-ratecategory", createRateCategory);
router.put("/update-ratecategory/:id", updateRateCategory);

module.exports = router;
