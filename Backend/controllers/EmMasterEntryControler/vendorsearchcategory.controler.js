const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all VendorSearchCategory records
const getVendorSearchCategory = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_MasterVendorSearchCategory");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET VendorSearchCategory  by ID
const getVendorSearchCategoryById = async (req, res) => {
  const { cate_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("cate_id", sql.VarChar(2), cate_id)
      .query(
        "SELECT * FROM EM_MasterVendorSearchCategory WHERE cate_id = @cate_id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE new VendorSearchCategory
const createVendorSearchCategory = async (req, res) => {
  const { cate_name, status } = req.body;

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }

  try {
    await poolConnect;

    // Check for duplicates
    // const checkResult = await pool
    //   .request()
    //   .input("cate_name", sql.NVarChar(100), cate_name)
    //   .query(
    //     "SELECT * FROM EM_MasterVendorSearchCategory WHERE cate_name = @cate_name"
    //   );

    // if (checkResult.recordset.length > 0) {
    //   return res.status(409).send("Vendor_Category already exists!");
    // }

    // Generate new VendorSearchCategory ID
    const idResult = await pool
      .request()
      .query(
        "SELECT MAX(CAST(cate_id AS INT)) AS maxId FROM EM_MasterVendorSearchCategory"
      );

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0");

    // Insert new VendorSearchCategory  record
    await pool
      .request()
      .input("cate_id", sql.Int, nextId)
      .input("cate_name", sql.VarChar(50), cate_name)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_MasterVendorSearchCategory (cate_id,cate_name, status)
        VALUES (@cate_id, @cate_name, @status)
      `);

    res.status(201).send(`created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE VendorSearchCategory by ID
const updateVendorSearchCategory = async (req, res) => {
  const { cate_id } = req.params;
  const { cate_name, status } = req.body;

  if (!cate_name || status === undefined) {
    return res.status(400).send("All fields are required");
  }
  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("cate_id", sql.Int, cate_id)
      .input("cate_name", sql.NVarChar(50), cate_name)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_MasterVendorSearchCategory
        SET cate_name = @cate_name,
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
  getVendorSearchCategory,
  getVendorSearchCategoryById,
  createVendorSearchCategory,
  updateVendorSearchCategory,
};
