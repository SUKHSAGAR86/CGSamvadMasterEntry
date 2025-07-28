//-------------------------Rate Category Start----------------------------------------
const {pool,poolConnect,sql}=require("../../database/dbConfig.js");


// Insert new RateCategory with auto-generated rate_category_cd
const createRateCategory =async (req, res) => {
  await poolConnect;

  const {
    rate_category_name,
    alternate_name,
    extra_rate_percent,
    Rate_Multi_factor,
    is_for_entry,
    status,
    display_order,
    entry_date,
    entry_time,
  } = req.body;

  const clientIP = req.ip;
  const numericStatus = status === "Active" ? 1 : 0;

  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // Get the current max rate_category_cd
    const result = await request.query(`
        SELECT TOP 1 rate_category_cd 
        FROM RateCategory 
        WHERE ISNUMERIC(rate_category_cd) = 1 
        ORDER BY CAST(rate_category_cd AS INT) DESC
      `);

    let nextCode = 1;
    if (result.recordset.length > 0) {
      nextCode = parseInt(result.recordset[0].rate_category_cd, 10) + 1;
    }

    const rate_category_cd = nextCode.toString().padStart(2, "0");

    await request
      .input("rate_category_cd", sql.VarChar(2), rate_category_cd)
      .input("rate_category_name", sql.VarChar(50), rate_category_name)
      .input("alternate_name", sql.VarChar(5), alternate_name)
      .input("extra_rate_percent", sql.Float, extra_rate_percent)
      .input("Rate_Multi_factor", sql.VarChar(1), Rate_Multi_factor)
      .input("is_for_entry", sql.VarChar(1), is_for_entry)
      .input("status", sql.Int, numericStatus)
      .input("display_order", sql.Int, display_order)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar(14), entry_time)
      .input("ip_address", sql.NVarChar(20), clientIP).query(`
          INSERT INTO RateCategory (
            rate_category_cd, rate_category_name, alternate_name, extra_rate_percent,
            Rate_Multi_factor, is_for_entry, status, display_order, entry_date,
            entry_time, ip_address
          ) VALUES (
            @rate_category_cd, @rate_category_name, @alternate_name, @extra_rate_percent,
            @Rate_Multi_factor, @is_for_entry, @status, @display_order, @entry_date,
            @entry_time, @ip_address
          )
        `);

    await transaction.commit();

    res.status(201).send({
      message: "Created successfully",
      rate_category_cd: rate_category_cd,
    });
  } catch (err) {
    await transaction.rollback();
    res
      .status(500)
      .send({ error: "Error inserting RateCategory: " + err.message });
  }
};

// GET all RateCategory
const  getRateCategory=  async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query("SELECT * FROM RateCategory");
    const records = result.recordset.map((item) => ({
      ...item,
      status: item.status === 1 ? "Active" : "Inactive",
    }));
    res.send(records);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// GET single RateCategory by ID
const getRateCategoryById= async (req, res) => {
  await poolConnect;
  try {
    const result = await pool
      .request()
      .input("rate_category_cd", sql.VarChar(2), req.params.id)
      .query(
        "SELECT * FROM RateCategory WHERE rate_category_cd = @rate_category_cd"
      );

    if (result.recordset.length > 0) {
      const record = result.recordset[0];
      record.status = record.status === 1 ? "Active" : "Inactive";
      res.send(record);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// UPDATE RateCategory by ID
const updateRateCategory= async (req, res) => {
  await poolConnect;

  const {
    rate_category_name,
    alternate_name,
    extra_rate_percent,
    Rate_Multi_factor,
    is_for_entry,
    status,
    display_order,
    modify_date,
    modify_time,
  } = req.body;

  const clientIP = req.ip;
  const numericStatus = status === "Active" ? 1 : 0;

  try {
    await pool
      .request()
      .input("rate_category_cd", sql.VarChar(2), req.params.id)
      .input("rate_category_name", sql.VarChar(50), rate_category_name)
      .input("alternate_name", sql.VarChar(5), alternate_name)
      .input("extra_rate_percent", sql.Float, extra_rate_percent)
      .input("Rate_Multi_factor", sql.VarChar(1), Rate_Multi_factor)
      .input("is_for_entry", sql.VarChar(1), is_for_entry)
      .input("status", sql.Int, numericStatus)
      .input("display_order", sql.Int, display_order)
      .input("modify_date", sql.Date, modify_date)
      .input("modify_time", sql.VarChar(14), modify_time)
      .input("modify_ip_address", sql.NVarChar(20), clientIP).query(`
          UPDATE RateCategory SET
            rate_category_name = @rate_category_name,
            alternate_name = @alternate_name,
            extra_rate_percent = @extra_rate_percent,
            Rate_Multi_factor = @Rate_Multi_factor,
            is_for_entry = @is_for_entry,
            status = @status,
            display_order = @display_order,
            modify_date = @modify_date,
            modify_time = @modify_time,
            modify_ip_address = @modify_ip_address
          WHERE rate_category_cd = @rate_category_cd
        `);

    res.send({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getRateCategory,
  getRateCategoryById,
  createRateCategory,
  updateRateCategory,
};

//------------------------------Rtare Category End ------------------------------------
