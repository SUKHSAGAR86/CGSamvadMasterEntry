const express = require("express");
// const verifyToken = require("../middleware/auth.middleware");
const {
  getDistrictNew,
  getDistrictNewById,
  createDistrictNew,
  updateDistrictNew,
} = require("../../controllers/MastreEntryControler/districtnew.controler");

const router = express.Router();

router.get("/get-districtnew", getDistrictNew);
router.get("/get-districtnew/:id", getDistrictNewById);
router.post("/add-districtnew", createDistrictNew);
router.put("/update-districtnew/:District_ID", updateDistrictNew);

module.exports = router;
