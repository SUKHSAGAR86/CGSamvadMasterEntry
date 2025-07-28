const express = require("express");

// const VerifyToken=require("../middleware/auth.middleware.js");

const {
  getTaxMaster,
  getTaxMasterById,
  createTaxMaster,
  updateTaxMaster,
} = require("../../controllers/MastreEntryControler/taxmaster.controler");

const router = express.Router();
router.get("/get-taxmaster", getTaxMaster);
router.get("/get-taxmaster/:sno", getTaxMasterById);
router.post("/add-taxmaster", createTaxMaster),
  router.put("/update-taxmaster/:sno", updateTaxMaster);

module.exports = router;
