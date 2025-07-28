const express = require("express");
const {
  getFinancialYear,
  getFinancialYearById,
  createFinancialYear,
  updateFinancialYear,
} = require("../../controllers/MastreEntryControler/financialyear.controler");
// const verifyToken=require("../middleware/auth.middleware.js")

const router = express.Router();
router.get("/get-financialyear", getFinancialYear);
router.get("/get-financialyear/:sno", getFinancialYearById);
router.post("/add-financialyear", createFinancialYear);
router.put("/update-financialyear/:sno", updateFinancialYear);

module.exports = router;
