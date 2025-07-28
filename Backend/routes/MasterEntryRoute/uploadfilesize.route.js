const express = require("express");
const {
  getUploadFileSize,
  getUploadFileSizeById,
  createUploadFileSize,
  updateUploadFileSize,
} = require("../../controllers/MastreEntryControler/uploadfilesize.controler");

const router = express.Router();
router.get("/get-uploadfilesize", getUploadFileSize);
router.get("/get-uploadfilesize/:sno", getUploadFileSizeById);
router.post("/add-uploadfilesize", createUploadFileSize);
router.put("/update-uploadfilesize/:sno", updateUploadFileSize);

module.exports = router;
