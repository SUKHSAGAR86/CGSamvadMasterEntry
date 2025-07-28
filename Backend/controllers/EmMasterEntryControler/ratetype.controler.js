const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all RateType records
const getRateType = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_RateType");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET RateType  by ID
const getRateTypeById = async (req, res) => {
  const { rate_type_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("rate_type_id", sql.VarChar(2), rate_type_id)
      .query(
        "SELECT * FROM EM_Master_RateType WHERE rate_type_id = @rate_type_id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE new RateType 
const createRateType = async (req, res) => {
  const { rate_type, status } = req.body;

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }

  try {
    await poolConnect;

    // Check for duplicates
    // const checkResult = await pool
    //   .request()
    //   .input("rate_type", sql.NVarChar(100), rate_type)
    //   .query(
    //     "SELECT * FROM EM_Master_RateType WHERE rate_type = @rate_type"
    //   );

    // if (checkResult.recordset.length > 0) {
    //   return res.status(409).send("Media type already exists!");
    // }

    // Generate new RateType ID
    const idResult = await pool
      .request()
      .query(
        "SELECT MAX(CAST(rate_type_id AS INT)) AS maxId FROM EM_Master_RateType"
      );

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0");

    // Insert new RateType  record 
    await pool
      .request()
      .input("rate_type_id", sql.VarChar(2), nextId)
      .input("rate_type", sql.VarChar(15), rate_type)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_Master_RateType (rate_type_id,rate_type, status)
        VALUES (@rate_type_id, @rate_type, @status)
      `);

    res.status(201).send(`created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE RateType by ID
const updateRateType = async (req, res) => {
  const { rate_type_id } = req.params;
  const {rate_type, status } = req.body;

  if (!rate_type || status === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("rate_type_id", sql.VarChar(2),rate_type_id)
      .input("rate_type", sql.NVarChar(100), rate_type)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_RateType
        SET rate_type = @rate_type,
            status = @status
        WHERE rate_type_id = @rate_type_id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("record not found !");
    }

    res.send("Rate Type updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getRateType,
  getRateTypeById,
  createRateType,
  updateRateType,
};
