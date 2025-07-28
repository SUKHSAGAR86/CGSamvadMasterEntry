const { pool, poolConnect, sql } = require("../../database/dbConfig");

// Get all records
const getMapWorkTypeJobType = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_Map_WorkType_JobType");
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get records by work_type_id
const getMapWorkTypeJobTypeById = async (req, res) => {
  const { work_type_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .query("SELECT * FROM EM_Master_Map_WorkType_JobType WHERE work_type_id = @work_type_id");
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Create new record
const createMapWorkTypeJobType = async (req, res) => {
  const {
    work_type_id,
    work_type,
    media_type_id,
    media_type,
    job_type_id,
    job_type_text,
    status,
  } = req.body;

  try {
    await poolConnect;
    await pool
      .request()
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .input("work_type", sql.NVarChar(100), work_type)
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("job_type_id", sql.VarChar(2), job_type_id)
      .input("job_type_text", sql.NVarChar(100), job_type_text)
      .input("status", sql.VarChar(1), status)
      .query(`
        INSERT INTO EM_Master_Map_WorkType_JobType 
        (work_type_id, work_type, media_type_id, media_type, job_type_id, job_type_text, status)
        VALUES (@work_type_id, @work_type, @media_type_id, @media_type, @job_type_id, @job_type_text, @status)
      `);

    res.status(201).send({ message: "Record inserted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update record using composite key: work_type_id + job_type_id
const updateMapWorkTypeJobType = async (req, res) => {
  const { work_type_id, old_job_type_id } = req.params;
  const {
    work_type,
    media_type_id,
    media_type,
    job_type_id,
    job_type_text,
    status,
  } = req.body;

  try {
    await poolConnect;
    await pool
      .request()
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .input("old_job_type_id", sql.VarChar(2), old_job_type_id)
      .input("work_type", sql.NVarChar(100), work_type)
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("job_type_id", sql.VarChar(2), job_type_id)
      .input("job_type_text", sql.NVarChar(100), job_type_text)
      .input("status", sql.VarChar(1), status)
      .query(`
        UPDATE EM_Master_Map_WorkType_JobType SET 
          work_type = @work_type,
          media_type_id = @media_type_id,
          media_type = @media_type,
          job_type_id = @job_type_id,
          job_type_text = @job_type_text,
          status = @status
        WHERE work_type_id = @work_type_id AND job_type_id = @old_job_type_id
      `);

    res.send({ message: "Record updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getMapWorkTypeJobType,
  getMapWorkTypeJobTypeById,
  createMapWorkTypeJobType,
  updateMapWorkTypeJobType,
};
