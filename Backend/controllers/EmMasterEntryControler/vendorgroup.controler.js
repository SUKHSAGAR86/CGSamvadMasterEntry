const { pool, poolConnect, sql } = require("../../database/dbConfig");

// Utility: Get current date and time
const getDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0]; // HH:MM:SS
  return { date, time };
};

// Utility: Get client IP address
const getClientIp = (req) => {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};

// GET all groups
const getVendorGroups = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_MasterVendorGroup");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//  GET group by ID
const getVendorGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("group_id", sql.VarChar(3), id)
      .query("SELECT * FROM EM_MasterVendorGroup WHERE group_id = @group_id");

    if (result.recordset.length === 0) {
      return res.status(404).send("Vendor group not found.");
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//  CREATE new group
const createVendorGroup = async (req, res) => {
  const {
    group_name,
    status,
    entry_by_user_type,
    entry_by_user_id,
    entry_by_user_name,
  } = req.body;

  const { date, time } = getDateTime();
  const ip = getClientIp(req);

  try {
    await poolConnect;

    // Check if group_name already exists
    const duplicateCheck = await pool
      .request()
      .input("group_name", sql.NVarChar(50), group_name)
      .query("SELECT * FROM EM_MasterVendorGroup WHERE group_name = @group_name");

    if (duplicateCheck.recordset.length > 0) {
      return res.status(409).send("Group name already exists.");
    }

    //  Auto-generate group_id
    const maxIdResult = await pool
      .request()
      .query("SELECT MAX(CAST(group_id AS INT)) AS maxId FROM EM_MasterVendorGroup");

    const maxId = maxIdResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(3, "0");

    await pool
      .request()
      .input("group_id", sql.VarChar(3), nextId)
      .input("group_name", sql.NVarChar(50), group_name)
      .input("status", sql.VarChar(1), status)
      .input("entry_date", sql.Date, date)
      .input("entry_time", sql.VarChar(20), time)
      .input("entry_by_ip_address", sql.VarChar(20), ip)
      .input("entry_by_user_type", sql.NVarChar(50), entry_by_user_type)
      .input("entry_by_user_id", sql.VarChar(10), entry_by_user_id)
      .input("entry_by_user_name", sql.NVarChar(50), entry_by_user_name).query(`
        INSERT INTO EM_MasterVendorGroup (
          group_id, group_name, status, entry_date, entry_time, entry_by_ip_address,
          entry_by_user_type, entry_by_user_id, entry_by_user_name
        ) VALUES (
          @group_id, @group_name, @status, @entry_date, @entry_time, @entry_by_ip_address,
          @entry_by_user_type, @entry_by_user_id, @entry_by_user_name
        )
      `);

    res.status(201).json({ message: "Vendor group created successfully.", group_id: nextId });
  } catch (error) {
    res.status(500).send(error.message);
  }
};


// 🔹 UPDATE group
const updateVendorGroup = async (req, res) => {
  const { group_id } = req.params;
  const {
    group_name,
    status,
    modify_by_user_type,
    modify_by_user_id,
    modify_by_user_name,
  } = req.body;

  const { date, time } = getDateTime();
  const ip = getClientIp(req);

  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("group_id", sql.VarChar(3), group_id)
      .input("group_name", sql.NVarChar(50), group_name)
      .input("status", sql.VarChar(1), status)
      .input("modify_date", sql.Date, date)
      .input("modify_time", sql.VarChar(20), time)
      .input("modify_by_ip_address", sql.VarChar(20), ip)
      .input("modify_by_user_type", sql.NVarChar(50), modify_by_user_type)
      .input("modify_by_user_id", sql.VarChar(10), modify_by_user_id)
      .input("modify_by_user_name", sql.NVarChar(50), modify_by_user_name)
      .query(`
        UPDATE EM_MasterVendorGroup SET
          group_name = @group_name,
          status = @status,
          modify_date = @modify_date,
          modify_time = @modify_time,
          modify_by_ip_address = @modify_by_ip_address,
          modify_by_user_type = @modify_by_user_type,
          modify_by_user_id = @modify_by_user_id,
          modify_by_user_name = @modify_by_user_name
        WHERE group_id = @group_id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Vendor group not found.");
    }

    res.status(200).send("Vendor group updated successfully.");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// //  DELETE group
// const deleteVendorGroup = async (req, res) => {
//   const { group_id } = req.params;
//   try {
//     await poolConnect;
//     const result = await pool
//       .request()
//       .input("group_id", sql.VarChar(3), group_id)
//       .query("DELETE FROM EM_MasterVendorGroup WHERE group_id = @group_id");

//     if (result.rowsAffected[0] === 0) {
//       return res.status(404).send("Vendor group not found.");
//     }

//     res.status(200).send("Vendor group deleted successfully.");
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

module.exports = {
  getVendorGroups,
  getVendorGroupById,
  createVendorGroup,
  updateVendorGroup,
  // deleteVendorGroup,
};
