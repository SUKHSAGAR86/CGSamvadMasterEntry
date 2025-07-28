const express = require("express");
// const VerifyToken=require("../middleware/auth.middleware.js");

const {
  getUploadFileExtension,
  getUploadFileExtensionById,
  createUploadFileExtension,
  updateUploadFileExtension,
} = require("../../controllers/MastreEntryControler/uploadfileextension.controler");

const router = express.Router();
router.get("/get-uploadfileextension", getUploadFileExtension);
router.get("/get-uploadfileextension/:sno", getUploadFileExtensionById);
router.post("/add-uploadfileextension", createUploadFileExtension);
router.put("/update-uploadfileextension/:sno", updateUploadFileExtension);

module.exports = router;
