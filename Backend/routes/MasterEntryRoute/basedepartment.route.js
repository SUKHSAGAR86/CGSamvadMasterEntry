const express = require("express");

const {
  createBaseDepartment,
  getBaseDepartment,
  updateBaseDepartment,
  getBaseDepartmentById,
} = require("../../controllers/MastreEntryControler/basedepartment.controler.js");
// const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/add-basedepartment", createBaseDepartment);
router.get("/get-basedepartment", getBaseDepartment);
router.get("/get-basedepartment/:id", getBaseDepartmentById);
router.put("/update-basedepartment/:id", updateBaseDepartment);

module.exports = router;
