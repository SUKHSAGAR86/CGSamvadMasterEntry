const express = require("express");
// const verifyToken = require("../middleware/auth.middleware");
const {
  createDesignation,
  getDesignation,
  getDesignationById,
  updateDesignation,
} = require("../../controllers/MastreEntryControler/designation.controler");

const router = express.Router();

router.post("/add-designation", createDesignation);
router.get("/get-designation", getDesignation);
router.get("/get-designation/:id", getDesignationById);
router.put("/update-designation/:id", updateDesignation);
module.exports = router;
