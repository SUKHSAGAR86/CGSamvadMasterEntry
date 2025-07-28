//---------------------------------------------Login-------------------------
// app.post("/login-admin", async (req, res) => {
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { pool, poolConnect, sql } = require("../database/dbConfig.js");

const logInAdmin = async (req, res) => {
  try {
    const { AdminId, Password } = req.body;

    if (!AdminId || !Password) {
      return res
        .status(400)
        .json({ message: "Admin Id and Password are required" });
    }

    const hashedInput = crypto
      .createHash("sha256")
      .update(Password)
      .digest("hex");

    await poolConnect;

    const poolConn = pool;

    const result = await poolConn
      .request()
      .input("AdminId", sql.VarChar, AdminId)
      .query("SELECT * FROM AdminUsers WHERE AdminId = @AdminId");

    const admin = result.recordset[0];

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (hashedInput !== admin.Password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign({ id: admin.AdminId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      admin: {
        AdminId: admin.AdminId,
        AdminName: admin.AdminName,
        Email: admin.Email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Register user route
const createAdmin = async (req, res) => {
  try {
    const { AdminId, AdminName, Password, Email, Mobile } = req.body;

    if (!AdminId || !AdminName || !Password || !Email || !Mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // const hashedPassword = sha256(Password);
    const hashedPassword = crypto
      .createHash("sha256")
      .update(Password)
      .digest("hex");

    await poolConnect;

    const poolConn = pool;

    // Check if email exists
    const existing = await poolConn
      .request()
      .input("AdminId", sql.VarChar, AdminId)
      .query("SELECT * FROM AdminUsers WHERE AdminId = @AdminId");

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: "Admin Id already exists" });
    }

    // Insert user
    await poolConn
      .request()
      .input("AdminId", sql.VarChar, AdminId)
      .input("AdminName", sql.VarChar, AdminName)
      .input("Password", sql.VarChar, hashedPassword)
      .input("Email", sql.VarChar, Email)
      .input("Mobile", sql.VarChar, Mobile)
      .query(
        `INSERT INTO AdminUsers (AdminId, AdminName, Password, Email, Mobile)
         VALUES (@AdminId, @AdminName, @Password, @Email, @Mobile)`
      );

    res.status(201).json({ message: "Admin Registered Successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  logInAdmin,
  createAdmin,
};
