const express = require("express");
const {
  getOffice,
  getOfficeById,
  createOffice,
  updateOffice,
} = require("../../controllers/MastreEntryControler/office.controler");
// const verifyToken=require("../middleware/auth.middleware.js")

const router = express.Router();
router.get("/get-office", getOffice);
router.get("/get-office/:id", getOfficeById);
router.post("/add-office", createOffice);
router.put("/update-office/:id", updateOffice);

module.exports = router;
