const express = require("express");

// const VerifyToken=require("../middleware/auth.middleware.js");

const {
  getUnitMaster,
  getUnitMasterById,
  createUnitMaster,
  updateUnitMaster,
} = require("../../controllers/MastreEntryControler/unitmaster.controler");

const router = express.Router();
router.get("/get-unitmaster", getUnitMaster);
router.get("/get-unitmaster/:id", getUnitMasterById);
router.post("/add-unitmaster", createUnitMaster);
router.put("/update-unitmaster/:id", updateUnitMaster);

module.exports = router;
