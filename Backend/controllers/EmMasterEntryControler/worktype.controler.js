const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all WorkType records
const getWorkType = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_WorkType");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET WorkType  by ID
const getWorkTypeById = async (req, res) => {
  const { work_type_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .query(
        "SELECT * FROM EM_Master_WorkType WHERE work_type_id = @work_type_id"
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
const createWorkType = async (req, res) => {
  const { work_type, accronym, status } = req.body;

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }

  try {
    await poolConnect;

    // Check for duplicates
    // const checkResult = await pool
    //   .request()
    //   .input("work_type", sql.NVarChar(100), work_type)
    //   .query(
    //     "SELECT * FROM EM_Master_WorkType WHERE work_type = @work_type"
    //   );

    // if (checkResult.recordset.length > 0) {
    //   return res.status(409).send("work type already exists!");
    // }

    // Generate new WorkType ID
    const idResult = await pool
      .request()
      .query(
        "SELECT MAX(CAST(work_type_id AS INT)) AS maxId FROM EM_Master_WorkType"
      );

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0");

    // Insert new WorkType  record 
    await pool
      .request()
      .input("work_type_id", sql.VarChar(2), nextId)
      .input("work_type", sql.NVarChar(100), work_type)
      .input("accronym", sql.VarChar(50), accronym)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_Master_WorkType (work_type_id,work_type, accronym, status)
        VALUES (@work_type_id, @work_type, @accronym, @status)
      `);

    res.status(201).send(`created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE WorkType by ID
const updateWorkType = async (req, res) => {
  const { work_type_id } = req.params;
  const {work_type,accronym, status } = req.body;

  if (!work_type || !accronym|| status === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .input("work_type", sql.NVarChar(100), work_type)
      .input("accronym", sql.NVarChar(100), accronym)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_WorkType
        SET work_type = @work_type,
            accronym = @accronym,
            status = @status
        WHERE work_type_id = @work_type_id
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
  getWorkType,
  getWorkTypeById,
  createWorkType,
  updateWorkType,
};
