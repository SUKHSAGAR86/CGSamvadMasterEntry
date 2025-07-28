const express = require("express");
const { logInAdmin, createAdmin } = require("../controllers/auth.controler.js");

const router = express.Router();

router.post("/create-admin", createAdmin);
router.post("/login-admin", logInAdmin);
// router.get("/get-admin", logInAdmin);
// router.put("/update-admin", logInAdmin);
// router.delete("/delete-admin", logInAdmin);

module.exports = router; // FIXED
