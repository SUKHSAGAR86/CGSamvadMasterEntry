//-----------------------------------Tax Master Start--------------------------------------------
 const {pool,poolConnect,sql}=require("../../database/dbConfig.js");  


// Utility: Get current date and time
const getDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];
  return { date, time };
};

// Auto-generate next sno
async function getNextSno() {
  await poolConnect;
  const pool = await poolConnect;
  const result = await pool
    .request()
    .query("SELECT MAX(CAST(sno AS INT)) AS maxSno FROM Tax_Master");
  const maxSno = result.recordset[0].maxSno || 0;
  return String(maxSno + 1).padStart(2, "0");
}


// GET one Tax Master record by Sno
const getTaxMasterById= async (req, res) => {
  try {
    await poolConnect;
    const pool = await poolConnect;

    const { sno } = req.params;

    const result = await pool
      .request()
      .input("sno", sql.VarChar(2), sno)
      .query("SELECT * FROM Tax_Master WHERE sno = @sno");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET all records
const getTaxMaster= async (req, res) => {
  try {
    await poolConnect;
    const pool = await poolConnect;
    const result = await pool.request().query("SELECT * FROM Tax_Master");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// INSERT new record
const createTaxMaster = async (req, res) => {
  try {
    await poolConnect;
    const pool = await poolConnect;

    const sno = await getNextSno();
    const ip_address = req.ip;
    const { date, time } = getDateTime();
    const entry_date = new Date(`${date}T${time}`);

    const {
      tax_type,
      tax_percentage,
      update_column_name,
      head_type,
      head_id,
      head_text,
      gst_state_id,
      from_date,
      to_date,
      display_status,
      status,
      display_order,
      tax_on_sno,
      IS_applicableFor,
    } = req.body;

    await pool
      .request()
      .input("sno", sql.VarChar(2), sno)
      .input("tax_type", sql.NVarChar(100), tax_type)
      .input("tax_percentage", sql.Float, tax_percentage)
      .input("update_column_name", sql.VarChar(50), update_column_name)
      .input("head_type", sql.NVarChar(20), head_type)
      .input("head_id", sql.VarChar(20), head_id)
      .input("head_text", sql.NVarChar(20), head_text)
      .input("gst_state_id", sql.VarChar(3), gst_state_id)
      .input("from_date", sql.DateTime, from_date)
      .input("to_date", sql.DateTime, to_date)
      .input("display_status", sql.VarChar(1), display_status)
      .input("status", sql.VarChar(1), status)
      .input("display_order", sql.Int, display_order)
      .input("tax_on_sno", sql.VarChar(2), tax_on_sno)
      .input("IS_applicableFor", sql.VarChar(100), IS_applicableFor)
      .input("entry_date", sql.DateTime, entry_date)
      .input("ip_address", sql.VarChar(20), ip_address).query(`
              INSERT INTO Tax_Master (
                sno, tax_type, tax_percentage, update_column_name,
                head_type, head_id, head_text, gst_state_id,
                from_date, to_date, display_status, status,
                display_order, tax_on_sno, IS_applicableFor,
                entry_date, ip_address
              )
              VALUES (
                @sno, @tax_type, @tax_percentage, @update_column_name,
                @head_type, @head_id, @head_text, @gst_state_id,
                @from_date, @to_date, @display_status, @status,
                @display_order, @tax_on_sno, @IS_applicableFor,
                @entry_date, @ip_address
              )
            `);

    res.status(201).send({ message: "Inserted successfully", sno });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE existing record
const updateTaxMaster= async (req, res) => {
  try {
    await poolConnect;
    const pool = await poolConnect;

    const { sno } = req.params;
    const ip_address = req.ip;
    const { date, time } = getDateTime();
    const entry_date = new Date(`${date}T${time}`);

    const {
      tax_type,
      tax_percentage,
      update_column_name,
      head_type,
      head_id,
      head_text,
      gst_state_id,
      from_date,
      to_date,
      display_status,
      status,
      display_order,
      tax_on_sno,
      IS_applicableFor,
    } = req.body;

    await pool
      .request()
      .input("sno", sql.VarChar(2), sno)
      .input("tax_type", sql.NVarChar(100), tax_type)
      .input("tax_percentage", sql.Float, tax_percentage)
      .input("update_column_name", sql.VarChar(50), update_column_name)
      .input("head_type", sql.NVarChar(20), head_type)
      .input("head_id", sql.VarChar(20), head_id)
      .input("head_text", sql.NVarChar(20), head_text)
      .input("gst_state_id", sql.VarChar(3), gst_state_id)
      .input("from_date", sql.DateTime, from_date)
      .input("to_date", sql.DateTime, to_date)
      .input("display_status", sql.VarChar(1), display_status)
      .input("status", sql.VarChar(1), status)
      .input("display_order", sql.Int, display_order)
      .input("tax_on_sno", sql.VarChar(2), tax_on_sno)
      .input("IS_applicableFor", sql.VarChar(100), IS_applicableFor)
      .input("entry_date", sql.DateTime, entry_date)
      .input("ip_address", sql.VarChar(20), ip_address).query(`
              UPDATE Tax_Master SET
                tax_type = @tax_type,
                tax_percentage = @tax_percentage,
                update_column_name = @update_column_name,
                head_type = @head_type,
                head_id = @head_id,
                head_text = @head_text,
                gst_state_id = @gst_state_id,
                from_date = @from_date,
                to_date = @to_date,
                display_status = @display_status,
                status = @status,
                display_order = @display_order,
                tax_on_sno = @tax_on_sno,
                IS_applicableFor = @IS_applicableFor,
                entry_date = @entry_date,
                ip_address = @ip_address
              WHERE sno = @sno
            `);

    res.send({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};



module.exports = {
  getTaxMaster,
  getTaxMasterById,
  createTaxMaster,
  updateTaxMaster,
};
//-------------------------------------Tax Master End--------------------------------------------
