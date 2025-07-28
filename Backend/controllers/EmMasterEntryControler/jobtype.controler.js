//--------------------------Job Type Controller-----------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Get all job type records
const getJobTypes = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_JobType");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};   

// Get a single job type by job_type_id
const getJobTypeById = async (req, res) => {
  const { job_type_id } = req.params;

  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("job_type_id", sql.VarChar(2), job_type_id)
      .query("SELECT * FROM EM_Master_JobType WHERE job_type_id = @job_type_id");

    if (result.recordset.length === 0) {
      return res.status(404).send("Job type record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Insert a new job type record with auto-generated padded ID and duplicate check
const createJobType = async (req, res) => {
  const { job_type_text, status } = req.body;

  if (!job_type_text){
    return res .status(400).send(`Job text is required !`)
  }

    if (status !== "0" && status !== "1") {
      return res
        .status(400)
        .send('Invalid status. Allowed values: "0", or "1"');
    }
  try {
    await poolConnect;

    // Step 1: Check if job_type_text already exists
    const checkResult = await pool
      .request()
      .input("job_type_text", sql.NVarChar(100), job_type_text)
      .query("SELECT * FROM EM_Master_JobType WHERE job_type_text = @job_type_text");

    if (checkResult.recordset.length > 0) {
      return res.status(409).send("Job type already exists ! ");
    }

    // Step 2: Get the highest current job_type_id
    const result = await pool
      .request()
      .query("SELECT MAX(CAST(job_type_id AS INT)) AS maxId FROM EM_Master_JobType");

    const maxId = result.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0"); // "01", "02", ...

    // Step 3: Insert the new job type
    await pool
      .request()
      .input("job_type_id", sql.VarChar(2), nextId)
      .input("job_type_text", sql.NVarChar(100), job_type_text)
      .input("status", sql.VarChar(1), status)
      .query(
        `INSERT INTO EM_Master_JobType (job_type_id, job_type_text, status)
         VALUES (@job_type_id, @job_type_text, @status)`
      );

    res.status(201).send(`Job type created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update an existing job type
const updateJobType = async (req, res) => {
  const { job_type_id } = req.params;
  const { job_type_text, status } = req.body;

  if (!job_type_text || status === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("job_type_id", sql.VarChar(2), job_type_id)
      .input("job_type_text", sql.NVarChar(100), job_type_text)
      .input("status", sql.VarChar(1), status)
      .query(
        `UPDATE EM_Master_JobType 
         SET job_type_text = @job_type_text, 
             status = @status 
         WHERE job_type_id = @job_type_id`
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Job type record not found");
    }

    res.send("Job type updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getJobTypes,
  getJobTypeById,
  createJobType,
  updateJobType,
};
