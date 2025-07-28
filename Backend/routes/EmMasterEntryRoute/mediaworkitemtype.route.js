const express = require("express");
const {
  getMediaWorkItemTypes,
  getMediaWorkItemTypeById,
  createMediaWorkItemType,
  updateMediaWorkItemType,
} = require("../../controllers/EmMasterEntryControler/mediaworkitemtype.controler");

const router = express.Router();
router.get("/get-mediaworkitemtype", getMediaWorkItemTypes);
router.get("/get-mediaworkitemtype/:id", getMediaWorkItemTypeById);
router.post("/add-mediaworkitemtype", createMediaWorkItemType);
router.put("/update-mediaworkitemtype/:id", updateMediaWorkItemType);

module.exports = router;
