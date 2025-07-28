const express = require("express");
// const verifyToken=require("../middleware/auth.middleware.js");
const {
  getNewsPaper,
  getNewsPaperById,
  createNewsPaper,
  updateNewsPaper,
} = require("../../controllers/MastreEntryControler/newspaper.controler.js");

const router = express.Router();
router.get("/get-newspaper", getNewsPaper);
router.get("/get-newspaper/:id", getNewsPaperById);
router.post("/add-newspaper", createNewsPaper);
router.put("/update-newspaper/:id", updateNewsPaper);
module.exports = router;
