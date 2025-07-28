const express = require("express");
const {
  createBankMaster,
  getBankMasters,
  updateBankMaster,
  getBankMastersById,
} = require("../../controllers/MastreEntryControler/bankmaster.controler.js");
// const verifyToken = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/add-bankmaster", createBankMaster);
router.get("/get-bankmaster", getBankMasters);
router.get("/get-bankmaster/:id", getBankMastersById);
router.put("/update-bankmaster/:id", updateBankMaster);

module.exports = router; // FIXED



