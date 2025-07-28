const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all VendorCategory records
const getVendorCategory = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_Vendor_Category");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET VendorCategory  by ID
const getVendorCategoryById = async (req, res) => {
  const { cate_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("cate_id", sql.VarChar(2), cate_id)
      .query(
        "SELECT * FROM EM_Master_Vendor_Category WHERE cate_id = @cate_id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE new VendorCategory 
const createVendorCategory = async (req, res) => {
  const { cate_text, status } = req.body;

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }

  try {
    await poolConnect;

    // Check for duplicates
    // const checkResult = await pool
    //   .request()
    //   .input("cate_text", sql.NVarChar(100), cate_text)
    //   .query(
    //     "SELECT * FROM EM_Master_Vendor_Category WHERE cate_text = @cate_text"
    //   );

    // if (checkResult.recordset.length > 0) {
    //   return res.status(409).send("Vendor_Category already exists!");
    // }

    // Generate new VendorCategory ID
    const idResult = await pool
      .request()
      .query(
        "SELECT MAX(CAST(cate_id AS INT)) AS maxId FROM EM_Master_Vendor_Category"
      );

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0");

    // Insert new VendorCategory  record 
    await pool
      .request()
      .input("cate_id", sql.VarChar(2), nextId)
      .input("cate_text", sql.VarChar(50), cate_text)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_Master_Vendor_Category (cate_id,cate_text, status)
        VALUES (@cate_id, @cate_text, @status)
      `);

    res.status(201).send(`created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE VendorCategory by ID
const updateVendorCategory = async (req, res) => {
  const { cate_id } = req.params;
  const {cate_text, status } = req.body;

  if (!cate_text || status === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("cate_id", sql.VarChar(2),cate_id)
      .input("cate_text", sql.NVarChar(50), cate_text)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_Vendor_Category
        SET cate_text = @cate_text,
            status = @status
        WHERE cate_id = @cate_id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("record not found !");
    }

    res.send("Vendor Category updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getVendorCategory,
  getVendorCategoryById,
  createVendorCategory,
  updateVendorCategory,
};
