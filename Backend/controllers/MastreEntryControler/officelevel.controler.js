//-------------------------------Office Level Start Here------------------------------------

const{pool,poolConnect,sql}=require("../../database/dbConfig.js");


//read get all ofiice level
const getOfficeLevel= async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM OfficeLevel");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get single record by OfficeLevelCode
const getOfficeLevelById=async (req, res) => {
  try {
    const result = await pool
      .request()
      .input("OfficeLevelCode", sql.VarChar(2), req.params.id)
      .query(
        "SELECT * FROM OfficeLevel WHERE  OfficeLevelCode = @OfficeLevelCode"
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: " OfficeLevelCode Not Found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insert new office level
const createOfficeLevel= async (req, res) => {
  const {
    OfficeLevelCode,
    CountryCode,
    StateCode,
    BaseDeptCode,
    OfficeLevelName,
    DisplayOrder,
    flag,
    entry_date,
    entry_time,
  } = req.body;
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    await pool
      .request()
      .input("OfficeLevelCode", sql.NVarChar(2), OfficeLevelCode)
      .input("CountryCode", sql.NVarChar(3), CountryCode)
      .input("StateCode", sql.NVarChar(3), StateCode)
      .input("BaseDeptCode", sql.NVarChar(4), BaseDeptCode)
      .input("OfficeLevelName", sql.NVarChar(50), OfficeLevelName)
      .input("DisplayOrder", sql.Int, DisplayOrder)
      .input("flag", sql.Int, flag)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar(14), entry_time)
      .input("ip_address", sql.NVarChar(20), clientIP).query(`
          INSERT INTO OfficeLevel(
          OfficeLevelCode,CountryCode,StateCode,BaseDeptCode,
          OfficeLevelName,DisplayOrder,flag,entry_date,entry_time,ip_address)
          
          VALUES(
              @OfficeLevelCode,@CountryCode,@StateCode,@BaseDeptCode,
          @OfficeLevelName,@DisplayOrder,@flag,@entry_date,@entry_time,@ip_address
          )`);
    res.status(201).json({ message: "Office Level Created Successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Office level
const updateOfficeLevel= async (req, res) => {
  const {
    CountryCode,
    StateCode,
    BaseDeptCode,
    OfficeLevelName,
    DisplayOrder,
    flag,
    modify_date,
    modify_time,
  } = req.body;
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    await pool
      .request()
      .input("OfficeLevelCode", sql.NVarChar(2), req.params.id)
      .input("CountryCode", sql.NVarChar(3), CountryCode)
      .input("StateCode", sql.NVarChar(3), StateCode)
      .input("BaseDeptCode", sql.NVarChar(4), BaseDeptCode)
      .input("OfficeLevelName", sql.NVarChar(50), OfficeLevelName)
      .input("DisplayOrder", sql.Int, DisplayOrder)
      .input("flag", sql.Int, flag)
      .input("modify_date", sql.Date, modify_date)
      .input("modify_time", sql.VarChar(14), modify_time)
      .input("modify_ip_address", sql.NVarChar(20), clientIP).query(`
  UPDATE OfficeLevel 
  SET
    CountryCode=@CountryCode,
      StateCode=@StateCode,
   BaseDeptCode=@BaseDeptCode,
   OfficeLevelName = @OfficeLevelName,
      DisplayOrder = @DisplayOrder,
      flag =@flag,
      modify_date =@modify_date,
      modify_time =@modify_time,
      modify_ip_address = @modify_ip_address
  
      WHERE OfficeLevelCode=@OfficeLevelCode
  
          `);

    res.json({ message: "Office level updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={
  getOfficeLevel,getOfficeLevelById,createOfficeLevel,updateOfficeLevel,
}





//-------------------------------Office Level End Here------------------------------------
