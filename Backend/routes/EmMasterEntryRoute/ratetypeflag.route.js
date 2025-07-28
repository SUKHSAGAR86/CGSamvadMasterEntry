const express = require("express");

const {
  getRateTypeFlag,
  createRateTypeFlag,
  getRateTypeFlagById,
  updateRateTypeFlag,
} = require("../../controllers/EmMasterEntryControler/ratetypeflag.controler");

const router = express.Router();

router.get("/get-ratetypeflag", getRateTypeFlag);
router.get("/get-ratetypeflag/:rate_type_id", getRateTypeFlagById);
router.post("/add-ratetypeflag", createRateTypeFlag);
router.put("/update-ratetypeflag/:rate_type_id", updateRateTypeFlag);

module.exports = router;
