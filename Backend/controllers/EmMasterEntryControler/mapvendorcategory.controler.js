const {pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Get all Media Vendor Categories
const getMapVendorCategory = async (req, res) => {
  try {
    const pool = await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_Map_Vendor_Category");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching MapVendorCategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get a single Media Vendor Category by media_type_id
const getMapVendorCategoryById = async (req, res) => {
  try {
    await poolConnect;
    const { media_type_id } = req.params;

    const result = await pool
      .request()
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .query(
        "SELECT * FROM EM_Master_Map_Vendor_Category WHERE media_type_id = @media_type_id"
      );

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Create a new Map Vendor Category
const createMapVendorCategory = async (req, res) => {
  try {
    const {
      media_type_id,
      media_type,
      vendor_id,
      vendor_name,
      cate_id,
      cate_text,
      status,
    } = req.body;

    await pool
      .request()
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("vendor_id", sql.VarChar(6), vendor_id)
      .input("vendor_name", sql.NVarChar(200), vendor_name)
      .input("cate_id", sql.VarChar(2), cate_id)
      .input("cate_text", sql.NVarChar(50), cate_text)
      .input("status", sql.VarChar(1), status).query(`
          INSERT INTO EM_Master_Map_Vendor_Category 
          (media_type_id, media_type, vendor_id, vendor_name, cate_id, cate_text, status)
          VALUES (@media_type_id, @media_type, @vendor_id, @vendor_name, @cate_id, @cate_text, @status)
        `);

    res.status(201).send(`Created successfully with ID ${media_type_id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// Update existing Media Vendor Category
const updateMapVendorCategory = async (req, res) => {
  try {
    const { media_type, vendor_id, vendor_name, cate_id, cate_text, status } =
      req.body;
    const { media_type_id } = req.params; // media_type_id from URL

    await pool
      .request()
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("vendor_id", sql.VarChar(6), vendor_id)
      .input("vendor_name", sql.NVarChar(200), vendor_name)
      .input("cate_id", sql.VarChar(2), cate_id)
      .input("cate_text", sql.NVarChar(50), cate_text)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_Map_Vendor_Category SET
          media_type = @media_type,
          vendor_id = @vendor_id,
          vendor_name = @vendor_name,
          cate_id = @cate_id,
          cate_text = @cate_text,
          status = @status
        WHERE media_type_id = @media_type_id
      `);

    res.status(200).send(`Updated successfully with ID ${media_type_id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getMapVendorCategory,
  getMapVendorCategoryById,
  createMapVendorCategory,
  updateMapVendorCategory,
};
