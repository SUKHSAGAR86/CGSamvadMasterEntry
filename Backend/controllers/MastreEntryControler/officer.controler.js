//--------------------------------Officer Entry Start Here---------------------------------------------

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

// GET all officer
const getOfficer = async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query("SELECT * FROM Officer");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET officer by ID
const getOfficerById = async (req, res) => {
  await poolConnect;
  try {
    const result = await pool
      .request()
      .input("employee_id", sql.VarChar(15), req.params.id)
      .query("SELECT * FROM Officer WHERE employee_id = @employee_id");

    if (result.recordset.length === 0) {
      res.status(404).send("Officer not found");
    } else {
      res.json(result.recordset[0]);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// POST new officer
const createOfficer = async (req, res) => {
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
        INSERT INTO Officer (
         DistrictCode,CountryCode,StateCode,employee_id,employee_name,employee_name_E,
         employee_dob,employee_mob,employee_emailid,designation_id,user_code,emp_level,
         employee_alt_mobile,employe_alt_email,office_mobile_no,OfficeCode,OfficerCode,
         OldDistrictCode,BaseDepartCode,entryyear,flag,DisplayOrder,
         entry_date,address,entry_time, ip_address
        ) VALUES (
         @DistrictCode,@CountryCode,@StateCode,@employee_id,@employee_name,@employee_name_E,
         @employee_dob,@employee_mob,@employee_emailid,@designation_id,@user_code,@emp_level,
         @employee_alt_mobile,@employe_alt_email,@office_mobile_no,@OfficeCode,@OfficerCode,
         @OldDistrictCode,@BaseDepartCode,@entryyear,@flag,@DisplayOrder,@entry_date,@address,
         @entry_time,@ip_address
        )
      `);

    res.status(201).send("Officer Add successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update Officer by employee_id
const updateOfficer = async (req, res) => {
  await poolConnect;
  const data = req.body;
  const { ip, date, time } = getClientInfo(req);

  try {
    const request = pool.request();

    // Avoid redeclaring important parameters
    Object.keys(data).forEach((key) => {
      if (
        ![
          "modify_ip_address",
          "modify_date",
          "modify_time",
          "employee_id",
        ].includes(key)
      ) {
        request.input(key, data[key]);
      }
    });

    // Add system-generated fields
    request.input("modify_ip_address", sql.VarChar(50), ip);
    request.input("modify_date", sql.VarChar(10), date);
    request.input("modify_time", sql.VarChar(8), time);
    request.input("employee_id", sql.VarChar(15), req.params.id);

    await request.query(`
        UPDATE Officer SET
          DistrictCode=@DistrictCode, CountryCode=@CountryCode, StateCode=@StateCode, employee_name=@employee_name,
          employee_name_E=@employee_name_E, employee_dob=@employee_dob, employee_mob=@employee_mob,
          employee_emailid=@employee_emailid, designation_id=@designation_id, user_code=@user_code, emp_level=@emp_level,
          employee_alt_mobile=@employee_alt_mobile, employe_alt_email=@employe_alt_email, office_mobile_no=@office_mobile_no,
          OfficeCode=@OfficeCode, OfficerCode=@OfficerCode, OldDistrictCode=@OldDistrictCode, BaseDepartCode=@BaseDepartCode,
          entryyear=@entryyear, flag=@flag, DisplayOrder=@DisplayOrder,
          modify_date=@modify_date, modify_time=@modify_time, modify_ip_address=@modify_ip_address
        WHERE employee_id = @employee_id
      `);

    res.send("Officer updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getOfficer,
  getOfficerById,
  createOfficer,
  updateOfficer,
};
//--------------------------------Officer Entry End Here-----------------------------------------------
