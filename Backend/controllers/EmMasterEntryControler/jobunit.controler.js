//--------------------------Job Unit Controller-----------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Get all Job Unit records
const getJobUnit = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query("SELECT * FROM EM_Master_JobUnit");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get a single Job Unit by unit_id
const getJobUnitById = async (req, res) => {
  const { unit_id } = req.params;

  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("unit_id", sql.VarChar(2), unit_id)
      .query("SELECT * FROM EM_Master_JobUnit WHERE unit_id = @unit_id");

    if (result.recordset.length === 0) {
      return res.status(404).send("Job Unit record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Insert a new Job Unit record with auto-generated padded ID and duplicate check
const createJobUnit = async (req, res) => {
  const { unit_text, status } = req.body;

if (!unit_text || (status !== "0" && status !== "1")) {
  return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
}
  try {
    await poolConnect;

    // Step 1: Check if unit_text already exists
    const checkResult = await pool
      .request()
      .input("unit_text", sql.NVarChar(50), unit_text)
      .query("SELECT * FROM EM_Master_JobUnit WHERE unit_text = @unit_text");

    if (checkResult.recordset.length > 0) {
      return res.status(409).send("Job Unit already exists ! ");
    }

    // Step 2: Get the highest current unit_id
    const result = await pool
      .request()
      .query("SELECT MAX(CAST(unit_id AS INT)) AS maxId FROM EM_Master_JobUnit");

    const maxId = result.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0"); // "01", "02", ...

    // Step 3: Insert the new Job Unit
    await pool
      .request()
      .input("unit_id", sql.VarChar(2), nextId)
      .input("unit_text", sql.NVarChar(50), unit_text)
      .input("status", sql.VarChar(1), status)
      .query(
        `INSERT INTO EM_Master_JobUnit (unit_id, unit_text, status)
         VALUES (@unit_id, @unit_text, @status)`
      );

    res.status(201).send(`Job Unit created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update an existing Job Unit
const updateJobUnit = async (req, res) => {
  const { unit_id } = req.params;
  const { unit_text, status } = req.body;

  if (!unit_text || !status) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("unit_id", sql.VarChar(2), unit_id)
      .input("unit_text", sql.NVarChar(100), unit_text)
      .input("status", sql.VarChar(1), status)
      .query(
        `UPDATE EM_Master_JobUnit 
         SET unit_text = @unit_text, 
             status = @status 
         WHERE unit_id = @unit_id`
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Job Unit record not found");
    }

    res.send("Job Unit updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getJobUnit,
  getJobUnitById,
  createJobUnit,
  updateJobUnit,
};
