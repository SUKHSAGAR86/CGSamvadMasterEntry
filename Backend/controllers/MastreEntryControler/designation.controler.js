

//-----------------------------------Designation Table start here...-------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Get all designations
const getDesignation= async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query("SELECT * FROM Designation");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get designation by ID
const getDesignationById= async (req, res) => {
  try {
    const { id } = req.params;
    await poolConnect;
    const result = await pool
      .request()
      .input("designation_cd", sql.VarChar(3), id)
      .query(
        "SELECT * FROM Designation WHERE designation_cd = @designation_cd"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("Designation not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Insert designation with sequential designation_cd
const createDesignation=async (req, res) => {
  const {
    designation_level_id,
    status,
    order_no,
    designation_name_E,
    designation_name_H,
    ip_address,
    modify_ip_address,
  } = req.body;

  const now = new Date();
  const entry_date = now;
  // const entry_time = now.toISOString().slice(11, 19).replace(/:/g, "");
  const entry_time = now.toISOString().slice(11, 19);

  const modify_date = entry_date;
  // const modify_time = entry_time;

  try {
    await poolConnect;

    // Generate next sequential designation_cd
    const result = await pool
      .request()
      .query(
        `SELECT ISNULL(MAX(CAST(designation_cd AS INT)),0) + 1 AS nextId FROM Designation`
      );

    const nextId = result.recordset[0].nextId.toString().padStart(3, "0"); // convert to string for VarChar

    await // .input("modify_ip_address", sql.NVarChar(20), modify_ip_address)

    //modify_time,  @modify_time , modify_ip_address , @modify_ip_address, modify_date,@modify_date,
    pool
      .request()
      .input("designation_cd", sql.VarChar(3), nextId)
      .input("designation_level_id", sql.NVarChar(2), designation_level_id)
      .input("status", sql.Int, status)
      .input("order_no", sql.Int, order_no)
      .input("designation_name_E", sql.NVarChar(100), designation_name_E)
      .input("designation_name_H", sql.NVarChar(200), designation_name_H)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar(14), entry_time)
      // .input("modify_date", sql.Date, modify_date)
      // .input("modify_time", sql.VarChar(14), modify_time)
      .input("ip_address", sql.NVarChar(20), ip_address).query(`
          INSERT INTO Designation (
            designation_cd, designation_level_id, status, order_no,
            designation_name_E, designation_name_H, entry_date, entry_time,
           ip_address
          )
            
          VALUES (
            @designation_cd, @designation_level_id, @status, @order_no,
            @designation_name_E, @designation_name_H, @entry_date, @entry_time,
             @ip_address
          )
        `);

    res.status(201).json({
      message: "Designation inserted successfully",
      designation_cd: nextId,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update designation
const updateDesignation= async (req, res) => {
  const { id } = req.params;
  const {
    designation_level_id,
    status,
    order_no,
    designation_name_E,
    designation_name_H,
    // ip_address,
    modify_ip_address,
  } = req.body;

  const modify_date = new Date();
  const modify_time = modify_date.toISOString().slice(11, 19);

  try {
    await poolConnect;
    await pool
      .request()
      .input("designation_cd", sql.VarChar(3), id)
      .input("designation_level_id", sql.NVarChar(2), designation_level_id)
      .input("status", sql.Int, status)
      .input("order_no", sql.Int, order_no)
      .input("designation_name_E", sql.NVarChar(100), designation_name_E)
      .input("designation_name_H", sql.NVarChar(200), designation_name_H)
      .input("modify_date", sql.Date, modify_date)
      .input("modify_time", sql.VarChar(14), modify_time)
      // .input("ip_address", sql.NVarChar(20), ip_address),  ip_address = @ip_address,
      .input("modify_ip_address", sql.NVarChar(20), modify_ip_address).query(`
          UPDATE Designation SET
            designation_level_id = @designation_level_id,
            status = @status,
            order_no = @order_no,
            designation_name_E = @designation_name_E,
            designation_name_H = @designation_name_H,
            modify_date = @modify_date,
            modify_time = @modify_time,
           
            modify_ip_address = @modify_ip_address
          WHERE designation_cd = @designation_cd
        `);
    res.send("Designation updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getDesignation,
  getDesignationById,
  createDesignation,
  updateDesignation,
};
//-----------------------------------Designation Table end here...-------------------------