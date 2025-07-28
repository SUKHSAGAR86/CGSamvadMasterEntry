//-----------------------------UnitMaster start here---------------------------

const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Helper: Date and Time functions
function getCurrentDate() {
  return new Date().toISOString().slice(0, 10); // yyyy-mm-dd
}
function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 8); // hh:mm:ss
}

//  Helper: Generate Next Unit ID
async function getNextUnitId() {
  await poolConnect;
  const result = await pool
    .request()
    .query("SELECT MAX(CAST(unit_id AS INT)) AS maxId FROM UnitMaster");
  const maxId = result.recordset[0].maxId || 0;
  return (parseInt(maxId) + 1).toString().padStart(2, "0");
}

// Insert here
const createUnitMaster = async (req, res) => {
  const { unit } = req.body;
  const unit_id = await getNextUnitId();
  const entry_date = getCurrentDate();
  const entry_time = getCurrentTime();
  const ip_address = req.ip;

  try {
    await poolConnect;
    await pool
      .request()
      .input("unit_id", sql.VarChar, unit_id)
      .input("unit", sql.VarChar, unit)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar, entry_time)
      .input("ip_address", sql.VarChar, ip_address).query(`
          INSERT INTO UnitMaster (unit_id, unit, entry_date, entry_time, ip_address)
          VALUES (@unit_id, @unit, @entry_date, @entry_time, @ip_address)
        `);
    res.status(201).json({ message: "Unit created successfully", unit_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//READ  Get ALL Units
const getUnitMaster = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM UnitMaster ORDER BY unit_id");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//READ - Get single by ID
const getUnitMasterById = async (req, res) => {
  try {
    const result = await pool
      .request()
      .input("unit_id", sql.NVarChar(2), req.params.id)
      .query("SELECT * FROM UnitMaster WHERE unit_id=@unit_id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Unit Id is not found." });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateUnitMaster = async (req, res) => {
  const { id } = req.params;
  const { unit } = req.body;
  const modify_date = getCurrentDate();
  const modify_time = getCurrentTime();
  const modify_ip_address = req.ip;

  try {
    await poolConnect;
    await pool
      .request()
      .input("unit_id", sql.VarChar, id)
      .input("unit", sql.VarChar, unit)
      .input("modify_date", sql.Date, modify_date)
      .input("modify_time", sql.VarChar, modify_time)
      .input("modify_ip_address", sql.VarChar, modify_ip_address).query(`
          UPDATE UnitMaster
          SET unit = @unit,
              modify_date = @modify_date,
              modify_time = @modify_time,
              modify_ip_address = @modify_ip_address
          WHERE unit_id = @unit_id
        `);
    res.json({ message: "Unit updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUnitMaster,
  getUnitMaster,
  getUnitMasterById,
  updateUnitMaster,
};
// ------------------------UnitMaster End Here-----------------------------------------
