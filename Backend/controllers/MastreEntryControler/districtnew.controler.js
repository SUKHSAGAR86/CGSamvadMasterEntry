//-------------------------------- Districts_new Start --------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Get all districtsnew
const getDistrictNew = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query("SELECT * FROM Districts_new");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


//Get by Id
const getDistrictNewById = async (req, res) => {
  try {
    const { id } = req.params;
    await poolConnect;

    const result = await pool
      .request()
      .input("District_ID", sql.VarChar(2), id) // ✅ Increased length
      .query("SELECT * FROM Districts_new WHERE District_ID = @District_ID");

    if (result.recordset.length === 0) {
      return res.status(404).send("District not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// Insert new district
const createDistrictNew= async (req, res) => {
  const {
    District_ID,
    District_Name,
    District_Name_En,
    Division_id,
    Division_name_Hindi,
    Division_name_English,
    CountryCode,
    StateCode,
    flag,
    DisplayOrder,
    ip_address,
  } = req.body;

  const now = new Date();
  const entry_date = now;
  const entry_time = now.toISOString().slice(11, 19);

  try {
    await poolConnect;

    await pool
      .request()
      .input("District_ID", sql.VarChar(2), District_ID)
      .input("District_Name", sql.NVarChar(255), District_Name)
      .input("District_Name_En", sql.NVarChar(255), District_Name_En)
      .input("Division_id", sql.Int, Division_id)
      .input("Division_name_Hindi", sql.NVarChar(50), Division_name_Hindi)
      .input("Division_name_English", sql.VarChar(50), Division_name_English)
      .input("CountryCode", sql.VarChar(3), CountryCode)
      .input("StateCode", sql.VarChar(3), StateCode)
      .input("flag", sql.Int, flag)
      .input("DisplayOrder", sql.Int, DisplayOrder)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar(14), entry_time)
      .input("ip_address", sql.NVarChar(20), ip_address).query(`
          INSERT INTO Districts_new (
            District_ID, District_Name, District_Name_En, Division_id,
            Division_name_Hindi, Division_name_English, CountryCode, StateCode,
            flag, DisplayOrder, entry_date, entry_time, ip_address
          ) VALUES (
            @District_ID, @District_Name, @District_Name_En, @Division_id,
            @Division_name_Hindi, @Division_name_English, @CountryCode, @StateCode,
            @flag, @DisplayOrder, @entry_date, @entry_time, @ip_address
          )
        `);

    res.status(201).json({ message: "District inserted", District_ID });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update district
const updateDistrictNew= async (req, res) => {
  const { District_ID } = req.params;
  const {
    District_Name,
    District_Name_En,
    Division_id,
    Division_name_Hindi,
    Division_name_English,
    CountryCode,
    StateCode,
    flag,
    DisplayOrder,
    modify_ip_address,
  } = req.body;

  const modify_date = new Date();
  const modify_time = modify_date.toISOString().slice(11, 19);

  try {
    await poolConnect;

    await pool
      .request()
      .input("District_ID", sql.VarChar(2), District_ID)
      .input("District_Name", sql.NVarChar(255), District_Name)
      .input("District_Name_En", sql.NVarChar(255), District_Name_En)
      .input("Division_id", sql.Int, Division_id)
      .input("Division_name_Hindi", sql.NVarChar(50), Division_name_Hindi)
      .input("Division_name_English", sql.VarChar(50), Division_name_English)
      .input("CountryCode", sql.VarChar(3), CountryCode)
      .input("StateCode", sql.VarChar(3), StateCode)
      .input("flag", sql.Int, flag)
      .input("DisplayOrder", sql.Int, DisplayOrder)
      .input("modify_date", sql.Date, modify_date)
      .input("modify_time", sql.VarChar(14), modify_time)
      .input("modify_ip_address", sql.NVarChar(20), modify_ip_address).query(`
          UPDATE Districts_new SET
            District_Name = @District_Name,
            District_Name_En = @District_Name_En,
            Division_id = @Division_id,
            Division_name_Hindi = @Division_name_Hindi,
            Division_name_English = @Division_name_English,
            CountryCode = @CountryCode,
            StateCode = @StateCode,
            flag = @flag,
            DisplayOrder = @DisplayOrder,
            modify_date = @modify_date,
            modify_time = @modify_time,
            modify_ip_address = @modify_ip_address
          WHERE District_ID = @District_ID
        `);

    res.send("District updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports={
  getDistrictNew,
  getDistrictNewById,
  createDistrictNew,
  updateDistrictNew,

};

//-------------------------------- Districts_new End--------------------------
