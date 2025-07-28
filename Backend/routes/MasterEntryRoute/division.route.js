const express = require("express");
// const verifyToken = require("../middleware/auth.middleware");
const {
  getDivision,
  getDivisionById,
  createDivision,
  updateDivision,
} = require("../../controllers/MastreEntryControler/division.controler");

const router = express.Router();

router.get("/get-division", getDivision);
router.get("/get-division/:id", getDivisionById);
router.post("/add-division", createDivision);
router.put("/update-division/:id", updateDivision);

module.exports = router;
