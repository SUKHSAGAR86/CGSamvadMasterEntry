// ratecategoryflag.controler.js

const { Int } = require("mssql");
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all RateTypeFlag records
const getRateTypeFlag = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_MasterRateTypeFlag");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET RateTypeFlag  by ID
const getRateTypeFlagById = async (req, res) => {
  const { rate_type_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("rate_type_id", sql.VarChar(2), rate_type_id)
      .query(
        "SELECT * FROM EM_MasterRateTypeFlag WHERE rate_type_id = @rate_type_id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE newWork Type
const createRateTypeFlag = async (req, res) => {
  const { flag_id, flag, status } = req.body;

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }
  if (!flag_id) {
    return res.status(400).send("flag_id is required");
  }

  try {
    await poolConnect;

    // Check for duplicates
    // const checkResult = await pool
    //   .request()
    //   .input("flag_id", sql.NVarChar(100), flag_id)
    //   .query(
    //     "SELECT * FROM EM_MasterRateTypeFlag WHERE flag_id = @flag_id"
    //   );

    // if (checkResult.recordset.length > 0) {
    //   return res.status(409).send("work type already exists!");
    // }

    // Generate new RateTypeFlag ID
    const idResult = await pool
      .request()
      .query(
        "SELECT MAX(CAST(rate_type_id AS INT)) AS maxId FROM EM_MasterRateTypeFlag"
      );

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0");

    // Insert new RateTypeFlag  record
    await pool
      .request()
      .input("rate_type_id", sql.VarChar(2), nextId)
      .input("flag_id", sql.Int, flag_id)
      .input("flag", sql.VarChar(50), flag)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_MasterRateTypeFlag (rate_type_id,flag_id, flag, status)
        VALUES (@rate_type_id, @flag_id, @flag, @status)
      `);

    res.status(201).send(`created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE RateTypeFlag by ID
const updateRateTypeFlag = async (req, res) => {
  const { rate_type_id } = req.params;
  const { flag_id, flag, status } = req.body;

  if (!flag_id || !flag || status === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("rate_type_id", sql.VarChar(2), rate_type_id)
      .input("flag_id", Int, flag_id)
      .input("flag", sql.NVarChar(50), flag)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_MasterRateTypeFlag
        SET flag_id = @flag_id,
            flag = @flag,
            status = @status
        WHERE rate_type_id = @rate_type_id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("record not found !");
    }

    res.send("Work Type updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getRateTypeFlag,
  getRateTypeFlagById,
  createRateTypeFlag,
  updateRateTypeFlag,
};

