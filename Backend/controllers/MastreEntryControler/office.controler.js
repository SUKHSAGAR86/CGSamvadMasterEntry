//------------------------------------Master entry for Office Start Here-------------------------------

const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Helper function to get IP, date, and time
function getClientInfo(req) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const now = new Date();

  const pad = (n) => n.toString().padStart(2, "0");

  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;

  return { ip, date, time };
}

// GET all offices
const getOffice = async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query("SELECT * FROM Office");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET office by ID
const getOfficeById = async (req, res) => {
  await poolConnect;
  try {
    const result = await pool
      .request()
      .input("NewOfficeCode", sql.VarChar(50), req.params.id)
      .query("SELECT * FROM Office WHERE NewOfficeCode = @NewOfficeCode");

    if (result.recordset.length === 0) {
      res.status(404).send("Office not found");
    } else {
      res.json(result.recordset[0]);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// POST new office
const createOffice = async (req, res) => {
  await poolConnect;
  const data = req.body;
  const { ip, date, time } = getClientInfo(req);

  try {
    const request = pool.request();
    Object.keys(data).forEach((key) => {
      request.input(key, data[key]);
    });

    request.input("ip_address", sql.VarChar(50), ip);
    request.input("entry_date", sql.VarChar(10), date);
    request.input("entry_time", sql.VarChar(8), time);

    await request.query(`
        INSERT INTO Office (
          OfficeName, OfficeName_E, client_code, BaseDeptCode, OfficeLevel, NewOfficeCode,
          DistrictCodeNew, CountryCode, StateCode, OfficeAddress, OfficeArea, OfficePin,
          OfficeURL, landline_no, Email, Fax, std_code, Mobile_no, GST_legalName,
          GST_number, GST_StateID, GST_StateText, GST_DateOfRegistration, GST_TaxpayerType,
          flag, DisplayOrder, entry_date, entry_time, ip_address
        ) VALUES (
          @OfficeName, @OfficeName_E, @client_code, @BaseDeptCode, @OfficeLevel, @NewOfficeCode,
          @DistrictCodeNew, @CountryCode, @StateCode, @OfficeAddress, @OfficeArea, @OfficePin,
          @OfficeURL, @landline_no, @Email, @Fax, @std_code, @Mobile_no, @GST_legalName,
          @GST_number, @GST_StateID, @GST_StateText, @GST_DateOfRegistration, @GST_TaxpayerType,
          @flag, @DisplayOrder, @entry_date, @entry_time, @ip_address
        )
      `);

    res.status(201).send("Office created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Update
const updateOffice = async (req, res) => {
  await poolConnect;
  const data = req.body;
  const { ip, date, time } = getClientInfo(req);

  try {
    const request = pool.request();

    // Avoid redeclaring parameters
    Object.keys(data).forEach((key) => {
      if (!["modify_ip_address", "modify_date", "modify_time"].includes(key)) {
        request.input(key, data[key]);
      }
    });

    //Add modify fields manually
    request.input("modify_ip_address", sql.VarChar(50), ip);
    request.input("modify_date", sql.VarChar(10), date);
    request.input("modify_time", sql.VarChar(8), time);
    request.input("NewOfficeCode", sql.VarChar(50), req.params.id);

    await request.query(`
        UPDATE Office SET
          OfficeName = @OfficeName, OfficeName_E = @OfficeName_E, client_code = @client_code,
          BaseDeptCode = @BaseDeptCode, OfficeLevel = @OfficeLevel, DistrictCodeNew = @DistrictCodeNew,
          CountryCode = @CountryCode, StateCode = @StateCode, OfficeAddress = @OfficeAddress,
          OfficeArea = @OfficeArea, OfficePin = @OfficePin, OfficeURL = @OfficeURL,
          landline_no = @landline_no, Email = @Email, Fax = @Fax, std_code = @std_code,
          Mobile_no = @Mobile_no, GST_legalName = @GST_legalName, GST_number = @GST_number,
          GST_StateID = @GST_StateID, GST_StateText = @GST_StateText,
          GST_DateOfRegistration = @GST_DateOfRegistration, GST_TaxpayerType = @GST_TaxpayerType,
          flag = @flag, DisplayOrder = @DisplayOrder,
          modify_date = @modify_date, modify_time = @modify_time, modify_ip_address = @modify_ip_address
        WHERE NewOfficeCode = @NewOfficeCode
      `);

    res.send("Office updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getOffice,
  getOfficeById,
  createOffice,
  updateOffice,
};

//---------------------------------Entry for Office End Here------------------------------------------
