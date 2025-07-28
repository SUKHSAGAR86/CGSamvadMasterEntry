//------------------------------officer_level start------------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// READ - Get all officer levels
const getOfficerLevel = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM officer_level");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get single officer level by ID
const getOfficerLevelById = async (req, res) => {
  try {
    const result = await pool
      .request()
      .input("level_id", sql.NVarChar(2), req.params.id)
      .query("SELECT * FROM officer_level WHERE level_id = @level_id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Officer level not found." });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE - Add new officer level
const createOfficerLevel = async (req, res) => {
  const { level_id, level_name, entry_date, entry_time } = req.body;

  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    await pool
      .request()
      .input("level_id", sql.NVarChar(2), level_id)
      .input("level_name", sql.NVarChar(50), level_name)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar(14), entry_time)
      .input("ip_address", sql.NVarChar(20), clientIP).query(`
          INSERT INTO officer_level (
            level_id, level_name, entry_date, entry_time,ip_address
          )
          VALUES (
            @level_id, @level_name, @entry_date, @entry_time,@ip_address
          )
        `);

    res.status(201).json({ message: "Officer level created successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - Update officer level
const updateOfficerLevel = async (req, res) => {
  const { level_name, modify_date, modify_time } = req.body;
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    await pool
      .request()
      .input("level_id", sql.NVarChar(2), req.params.id)
      .input("level_name", sql.NVarChar(50), level_name)
      .input("modify_date", sql.Date, modify_date)
      .input("modify_time", sql.VarChar(14), modify_time)
      .input("modify_ip_address", sql.NVarChar(20), clientIP).query(`
          UPDATE officer_level
          SET
            level_name = @level_name,
            modify_date = @modify_date,
            modify_time = @modify_time,
            modify_ip_address = @modify_ip_address
          WHERE level_id = @level_id
        `);

    res.json({ message: "Officer level updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOfficerLevel,
  getOfficerLevelById,
  createOfficerLevel,
  updateOfficerLevel,
};
//------------------------------officer_level end------------------------------
