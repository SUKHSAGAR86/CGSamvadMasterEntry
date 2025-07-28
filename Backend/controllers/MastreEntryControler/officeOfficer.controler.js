//------------------------office_officer start here-------------------------------------
 const {pool,poolConnect,sql}=require("../../database/dbConfig.js")
// ====== Helper: Get Client IP, Date, Time ======
function getClientInfo(req) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const date = `${pad(now.getDate())}-${pad(
    now.getMonth() + 1
  )}-${now.getFullYear()}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;
  return { ip, date, time };
}

// ====== GET ALL ======
const getOfficeOfficer= async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query("SELECT * FROM office_officer");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ====== GET ONE BY SNO ======
const getOfficeOfficerById= async (req, res) => {
  await poolConnect;
  try {
    const result = await pool
      .request()
      .input("sno", sql.BigInt, req.params.sno)
      .query("SELECT * FROM office_officer WHERE sno = @sno");

    if (result.recordset.length === 0) res.status(404).send("Not found");
    else res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ====== CREATE ======
const createOfficeOfficer= async (req, res) => {
  await poolConnect;
  const data = req.body;
  const { ip, date, time } = getClientInfo(req);

  try {
    // Get next sno
    const result = await pool
      .request()
      .query("SELECT ISNULL(MAX(sno), 0) + 1 AS nextSno FROM office_officer");
    const sno = result.recordset[0].nextSno;

    const request = pool.request();
    request.input("sno", sql.BigInt, sno);
    request.input("CountryCode", sql.VarChar(3), data.CountryCode);
    request.input("StateCode", sql.VarChar(3), data.StateCode);
    request.input("designation_sno", sql.NVarChar(2), data.designation_sno);
    request.input("section_code", sql.NVarChar(11), data.section_code);
    request.input("employee_code", sql.NVarChar(11), data.employee_code);
    request.input("base_dept_code", sql.NVarChar(4), data.base_dept_code);
    request.input("office_code", sql.NVarChar(10), data.office_code);
    request.input("district_code", sql.NVarChar(2), data.district_code);
    request.input("user_code", sql.NVarChar(11), data.user_code);
    request.input("status", sql.NVarChar(1), data.status);
    request.input("designation_id", sql.NVarChar(4), data.designation_id);
    request.input("prarup_code", sql.NVarChar(7), data.prarup_code);
    request.input("head_code", sql.VarChar(5), data.head_code);
    request.input("Commision_Percentage", sql.Float, data.Commision_Percentage);
    request.input("entry_date", sql.Date, new Date());
    request.input("entry_time", sql.VarChar(14), time);
    request.input("ip_address", sql.NVarChar(20), ip);

    await request.query(`
        INSERT INTO office_officer (
          sno, CountryCode, StateCode, designation_sno, section_code, employee_code,
          base_dept_code, office_code, district_code, user_code, status,
          designation_id, prarup_code, head_code, Commision_Percentage,
          entry_date, entry_time, ip_address
        ) VALUES (
          @sno, @CountryCode, @StateCode, @designation_sno, @section_code, @employee_code,
          @base_dept_code, @office_code, @district_code, @user_code, @status,
          @designation_id, @prarup_code, @head_code, @Commision_Percentage,
          @entry_date, @entry_time, @ip_address
        )
      `);

    res.status(201).send(`Record added with sno: ${sno}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ====== UPDATE ======
const updateOfficeOfficer= async (req, res) => {
  await poolConnect;
  const data = req.body;
  const { ip, date, time } = getClientInfo(req);

  try {
    const request = pool.request();
    request.input("sno", sql.BigInt, req.params.sno);
    request.input("CountryCode", sql.VarChar(3), data.CountryCode);
    request.input("StateCode", sql.VarChar(3), data.StateCode);
    request.input("designation_sno", sql.NVarChar(2), data.designation_sno);
    request.input("section_code", sql.NVarChar(11), data.section_code);
    request.input("employee_code", sql.NVarChar(11), data.employee_code);
    request.input("base_dept_code", sql.NVarChar(4), data.base_dept_code);
    request.input("office_code", sql.NVarChar(10), data.office_code);
    request.input("district_code", sql.NVarChar(2), data.district_code);
    request.input("user_code", sql.NVarChar(11), data.user_code);
    request.input("status", sql.NVarChar(1), data.status);
    request.input("designation_id", sql.NVarChar(4), data.designation_id);
    request.input("prarup_code", sql.NVarChar(7), data.prarup_code);
    request.input("head_code", sql.VarChar(5), data.head_code);
    request.input("Commision_Percentage", sql.Float, data.Commision_Percentage);
    request.input("modify_date", sql.Date, new Date());
    request.input("modify_time", sql.VarChar(14), time);
    request.input("modify_ip_address", sql.NVarChar(20), ip);

    await request.query(`
        UPDATE office_officer SET
          CountryCode = @CountryCode,
          StateCode = @StateCode,
          designation_sno = @designation_sno,
          section_code = @section_code,
          employee_code = @employee_code,
          base_dept_code = @base_dept_code,
          office_code = @office_code,
          district_code = @district_code,
          user_code = @user_code,
          status = @status,
          designation_id = @designation_id,
          prarup_code = @prarup_code,
          head_code = @head_code,
          Commision_Percentage = @Commision_Percentage,
          modify_date = @modify_date,
          modify_time = @modify_time,
          modify_ip_address = @modify_ip_address
        WHERE sno = @sno
      `);

    res.send("Record updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};



module.exports={
  getOfficeOfficer,getOfficeOfficerById,createOfficeOfficer,updateOfficeOfficer,
}
//----------------------------------office_officer End here----------------------------------
