const { sql, poolConnect, pool } = require("../../database/dbConfig");

// Utility function to get current date and time in SQL-friendly format
const getDateTime = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");

  // SQL Date: YYYY-MM-DD
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;

  return { date, time };
};

// Get All Map Vendor Groups
const getMapVendorGroups = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_Map_Vendor_Group");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Map Vendor Group by ID
const getMapVendorGroupById = async (req, res) => {
  try {
    await poolConnect;
    const request = pool.request();
    const { vendor_id } = req.params;

    request.input("vendor_id", sql.VarChar(6), vendor_id);
    const result = await request.query(
      "SELECT * FROM EM_Master_Map_Vendor_Group WHERE vendor_id = @vendor_id"
    );

    res.json(result.recordset[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Map Vendor Group
const createMapVendorGroup = async (req, res) => {
  try {
    await poolConnect;
    const request = pool.request();
    const {
      group_id,
      group_name,
      vendor_id,
      vendor_name,
      status,
      entry_by_user_type,
      entry_by_user_id,
      entry_by_user_name,
    } = req.body;

    const ip = req.ip || req.connection?.remoteAddress || "";
    const { date, time } = getDateTime();

    request
      .input("group_id", sql.VarChar(3), group_id)
      .input("group_name", sql.NVarChar(50), group_name)
      .input("vendor_id", sql.VarChar(6), vendor_id)
      .input("vendor_name", sql.NVarChar(100), vendor_name)
      .input("status", sql.VarChar(1), status)
      .input("entry_date", sql.Date, date)
      .input("entry_time", sql.VarChar(20), time)
      .input("entry_by_ip_address", sql.VarChar(20), ip)
      .input("entry_by_user_type", sql.NVarChar(50), entry_by_user_type)
      .input("entry_by_user_id", sql.VarChar(10), entry_by_user_id)
      .input("entry_by_user_name", sql.NVarChar(50), entry_by_user_name);

    await request.query(`
            INSERT INTO EM_Master_Map_Vendor_Group (
               group_id,group_name, vendor_id, vendor_name, status, entry_date, entry_time,
                entry_by_ip_address, entry_by_user_type, entry_by_user_id, entry_by_user_name
            )
            VALUES (
               @group_id, @group_name, @vendor_id, @vendor_name, @status, @entry_date, @entry_time,
                @entry_by_ip_address, @entry_by_user_type, @entry_by_user_id, @entry_by_user_name
            )
        `);

    res.status(201).json({ message: "Vendor group created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Map Vendor Group
const updateMapVendorGroup = async (req, res) => {
  try {
    await poolConnect;
    const request = pool.request();
    const { vendor_id, group_id } = req.params; // updated to read both params
    const {
      group_name,
      vendor_name,
      status,
      modify_by_user_type,
      modify_by_user_id,
      modify_by_user_name,
    } = req.body;

    if (status !== "0" && status !== "1") {
      return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
    }

    const ip = req.ip || req.connection?.remoteAddress || "";
    const { date, time } = getDateTime();

    request
      .input("vendor_id", sql.VarChar(6), vendor_id)
      .input("group_id", sql.VarChar(3), group_id)
      .input("group_name", sql.NVarChar(50), group_name)
      .input("vendor_name", sql.NVarChar(100), vendor_name)
      .input("status", sql.VarChar(1), status)
      .input("modify_date", sql.Date, date)
      .input("modify_time", sql.VarChar(20), time)
      .input("modify_by_ip_address", sql.VarChar(20), ip)
      .input("modify_by_user_type", sql.NVarChar(50), modify_by_user_type)
      .input("modify_by_user_id", sql.VarChar(10), modify_by_user_id)
      .input("modify_by_user_name", sql.NVarChar(50), modify_by_user_name);

    await request.query(`
      UPDATE EM_Master_Map_Vendor_Group
      SET
        group_name = @group_name,
        vendor_name = @vendor_name,
        status = @status,
        modify_date = @modify_date,
        modify_time = @modify_time,
        modify_by_ip_address = @modify_by_ip_address,
        modify_by_user_type = @modify_by_user_type,
        modify_by_user_id = @modify_by_user_id,
        modify_by_user_name = @modify_by_user_name
      WHERE vendor_id = @vendor_id AND group_id = @group_id
    `);

    res.json({ message: "Vendor group updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  getMapVendorGroups,
  getMapVendorGroupById,
  createMapVendorGroup,
  updateMapVendorGroup,
};
