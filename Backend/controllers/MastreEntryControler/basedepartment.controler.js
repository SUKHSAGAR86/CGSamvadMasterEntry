//-------------------------- Base Department Table --------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig");

// GET all departments
const getBaseDepartment = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query("SELECT * FROM Base_Department");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET department by ID
const getBaseDepartmentById= async (req, res) => {
  try {
    const { id } = req.params;
    await poolConnect;
    const result = await pool
      .request()
      .input("dept_id", sql.NVarChar(4), id)
      .query("SELECT * FROM Base_Department WHERE dept_id = @dept_id");

    if (result.recordset.length === 0) {
      return res.status(404).send("Department not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// INSERT department with auto-generated dept_id
const createBaseDepartment= async (req, res) => {
  const {
    dept_name,
    Commision_Percentage,
    discount_percent,
    flag,
    DisplayOrder,
    Remark,
  } = req.body;

  const now = new Date();
  const entry_date = now;
  const entry_time = now.toISOString().slice(11, 19);
  const ip_address =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    await poolConnect;

    // Generate next dept_id
    const result = await pool
      .request()
      .query("SELECT MAX(dept_id) AS maxId FROM Base_Department");

    let maxId = result.recordset[0].maxId || "D000";
    let num = parseInt(maxId.substring(1)) + 1;
    let newDeptId = "D" + num.toString().padStart(3, "0");

    await pool
      .request()
      .input("dept_id", sql.NVarChar(4), newDeptId)
      .input("dept_name", sql.NVarChar(75), dept_name)
      .input("Commision_Percentage", sql.Float, Commision_Percentage)
      .input("discount_percent", sql.Float, discount_percent)
      .input("flag", sql.Int, flag)
      .input("DisplayOrder", sql.Int, DisplayOrder)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar(14), entry_time)
      .input("ip_address", sql.NVarChar(20), ip_address)
      .input("Remark", sql.NVarChar(50), Remark).query(`
          INSERT INTO Base_Department (
            dept_id, dept_name, Commision_Percentage, discount_percent,
            flag, DisplayOrder, entry_date, entry_time, ip_address, Remark
          )
          VALUES (
            @dept_id, @dept_name, @Commision_Percentage, @discount_percent,
            @flag, @DisplayOrder, @entry_date, @entry_time, @ip_address, @Remark
          )
        `);

    res.send({
      message: "Department inserted successfully",
      dept_id: newDeptId,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE department
const updateBaseDepartment= async (req, res) => {
  const { id } = req.params;
  const {
    dept_name,
    Commision_Percentage,
    discount_percent,
    flag,
    DisplayOrder,
    Remark,
  } = req.body;

  const modify_date = new Date();
  const modify_time = modify_date.toISOString().slice(11, 19);
  const modify_ip_address =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    await poolConnect;
    await pool
      .request()
      .input("dept_id", sql.NVarChar(4), id)
      .input("dept_name", sql.NVarChar(75), dept_name)
      .input("Commision_Percentage", sql.Float, Commision_Percentage)
      .input("discount_percent", sql.Float, discount_percent)
      .input("flag", sql.Int, flag)
      .input("DisplayOrder", sql.Int, DisplayOrder)
      .input("modify_date", sql.Date, modify_date)
      .input("modify_time", sql.VarChar(14), modify_time)
      .input("modify_ip_address", sql.NVarChar(20), modify_ip_address)
      .input("Remark", sql.NVarChar(50), Remark).query(`
          UPDATE Base_Department SET
            dept_name = @dept_name,
            Commision_Percentage = @Commision_Percentage,
            discount_percent = @discount_percent,
            flag = @flag,
            DisplayOrder = @DisplayOrder,
            modify_date = @modify_date,
            modify_time = @modify_time,
            modify_ip_address = @modify_ip_address,
            Remark = @Remark
          WHERE dept_id = @dept_id
        `);
    res.send("Department updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = {
  getBaseDepartment,
  getBaseDepartmentById,
  createBaseDepartment,
  updateBaseDepartment,
};
//-----------------------------------Base Department Table End here...-------------------------
